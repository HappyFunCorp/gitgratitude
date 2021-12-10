#!/usr/bin/env ruby

require 'bundler/inline'

CONFIG_FILE = "deployment.toml"
IMAGE_PREFIX = "wschenk/"

gemfile do
  source 'https://rubygems.org'
  gem "toml", "~> 0.3.0"
end


def ask_yn( message )
  print message
  reply = STDIN.gets.chomp

  reply == 'y'
end

def read_config
  begin
    config = TOML::Parser.new(File.read(CONFIG_FILE)).parsed

    return config
  rescue Errno::ENOENT
    puts "Couldn't find file #{CONFIG_FILE}"
    
    if ask_yn( "Create? " )
      puts "Create"
      config = {
        "projects": {
          "image": "wschenk/projects",
          "service": "projects"
        }
      }

      write_config( config )

      return config
    end
    
    exit 1
  end
end

def write_config config
  File.open(CONFIG_FILE, "w") { |file| file.write TOML::Generator.new(config).body }
end

def build config, key
  puts "Building #{key}"

  image = nil
  image = config[key]["image"] if config[key]

  if image.nil?
    if ask_yn( "Image isn't set for #{key}, set to #{IMAGE_PREFIX}#{key}? " )
      image = "#{IMAGE_PREFIX}#{key}"
      config[key] ||= {}
      config[key]["image"] = image
    else
      puts "Please set the image for #{key}"
      exit 1
    end
  end

  if File.exists? "#{key}/Dockerfile"
    if !system( "docker build #{key} -t #{image} --platform linux/amd64 && docker push #{image}" )
      puts "Problem building, aborting"
      exit 1
    end
  else
    puts "#{key}/Dockerfile not present, skipping"
  end
end

def deploy( config, key )
  service = nil

  if( config[key].nil? || config[key]["image"].nil? )
    puts "#{key} image not set!"
    exit 1
  end
  
  service = config[key]["service"] if config[key]

  if service.nil?
    if ask_yn( "Service isn't set for #{key}, set to #{key}? " )
      config[key]["service"] = key
      service = key
    end
  end

  if system( "kn service describe #{service}" )
    system( "kn service update #{service} --image #{config[key]["image"]}" )
  else
    system( "kn service create #{service} --image #{config[key]["image"]}" )
  end
end

def database( config, key )
  database = config[key]['database']
  schema = config[key]['schema']
  
  if database.nil?
    puts "Database isn't set"
    exit 1
  end

  if schema.nil?
    puts "Schema isn't set"
    exit 1
  end

  puts "Looking up database password"
  password = `kubectl get secret --namespace default #{database} -o jsonpath="{.data.postgresql-password}" | base64 --decode`

  puts "Password is #{password}"
  puts "."

  localurl = "postgresql://postgres:#{password}@localhost:5433/#{schema}?schema=public"
  remoteurl = "postgresql://postgres:#{password}@#{database}.default.svc.cluster.local:5432/#{schema}?schema=public"


  puts "Starting port forwarder..."

  pid = spawn( "kubectl port-forward svc/postgres-postgresql 5433:5432" )

  puts "Waiting 1 second"

  sleep 1

  sub = fork do
    Dir.chdir(key)

    yield localurl, remoteurl
  end

  Process.wait sub

  Process.kill "TERM", pid
  puts "Waiting for port forwarder to stop"
  Process.wait pid
end

def migrate( config, key )
  database( config, key ) do |localurl, remoteurl|
    migrate = spawn( { "DATABASE_URL" => localurl }, "npx prisma migrate deploy" )
    Process.wait migrate
  end
end

def studio( config, key )
  database( config, key ) do |localurl, remoteurl|
    migrate = spawn( { "DATABASE_URL" => localurl }, "npx prisma studio" )
    Process.wait migrate
  end
end

def databaseurl( config, key )
  if config[key]["service"].nil?
    puts "No service for #{key}"
    exit 1
  end

  database( config, key ) do |localurl, remoteurl|
    system( "kn service update #{key} --env \'DATABASE_URL=#{remoteurl}\'" )
  end
end
          
config = read_config

if ARGV[0].nil? || ARGV[1].nil?
  puts "Usage: deployer {up,build,deploy} service_name"
  exit 1
end

case ARGV[0]
when 'up'
  build( config, ARGV[1] )
  deploy( config, ARGV[1] )
  migrate( config, ARGV[1] ) unless config[ARGV[1]]["database"].nil?
when 'build'
  build( config, ARGV[1] )
when 'deploy'
  deploy( config, ARGV[1])
when 'migrate'
  migrate( config, ARGV[1] )
when 'studio'
  studio( config, ARGV[1] )
when 'databaseurl'
  databaseurl( config, ARGV[1] )
end

write_config( config )


