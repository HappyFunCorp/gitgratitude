#!/usr/bin/env ruby
# -*-Ruby-*-

require 'digest'
require 'fileutils'

WORK_VOLUME=ENV['WORK_VOLUME'] || "./workspace"

class VolumeManager
  def initialize( dir = WORK_VOLUME )
    puts "Starting volume manager on #{dir}"
    @dir = dir
  end

  def dir_time t = Time.now
    t.strftime( "%Y%j" )
  end

  def last_x_days( count = 10 )
    count.times.collect do |t|
      dir_time( Time.now - (86400 * t) )
    end
  end

  def dir( url, t = Time.now )
    digest = Digest::MD5.hexdigest url

    FileUtils.mkdir_p "#{@dir}/#{dir_time(t)}"
    path = "#{@dir}/#{dir_time(t)}/#{digest}"

    existing = Dir.glob( "#{@dir}/*/#{digest}" ).select { |d| d != path }.first

    if existing
      puts "Found #{existing}, moving to #{path}"
      FileUtils.mv( existing, path )
    end

    FileUtils.mkdir_p path

    puts "Returning #{path} for #{url} at #{t}"
    
    path
  end

  def gc(keep_days = 10)
    entries = Dir.entries(@dir).select { |x| x[0] != '.' }

    (entries - last_x_days(keep_days)).each do |dir|
      system "rm -rf #{@dir}/#{dir}"
    end
  end
end

def write_file( file )
  puts "Writing to #{file}"
  system( "cp /Users/wschenk/pixel6downloads/FEMAwood_gas_generator.pdf #{file}" )
end

if __FILE__ == $0

  v = VolumeManager.new

  p v.last_x_days

  dir = v.dir( "willschenk.com", Time.now - (86400*3) )
  write_file( "#{dir}/10m" )

  dir = v.dir( "willschenk.com", Time.now - 86400 )
  write_file( "#{dir}/10m" )

  dir = v.dir( "willschenk.com" )
  write_file( "#{dir}/10m" )
  
  dir = v.dir( "gitgratitude.com", Time.now - (86400 * 13) )
  write_file( "#{dir}/10m" )

  dir = v.dir( "gitgratitude.com", Time.now - (86400 * 6) )
  write_file( "#{dir}/10m" )

  dir = v.dir( "gitgratitude.com" )
  write_file( "#{dir}/10m" )

  dir = v.dir( "happyfuncorp.com", Time.now - (86400 * 15) )
  write_file( "#{dir}/10m" )
  system( "du -sh workspace" )

  puts "Running gc"
  v.gc
  system( "du -sh workspace" )

  puts "Running gc"
  v.gc(5)
  system( "du -sh workspace" )

end
