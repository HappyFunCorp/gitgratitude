require 'uri'

begin
  require 'dotenv/load'
rescue LoadError
end

def backup_database database
  u = URI database

  db_name = u.path.gsub( /\//, "" )
  puts "Backing up #{db_name} to #{ENV['BUCKET_NAME']}"
  pid = spawn( {
                 "PGUSER" => u.user,
                 "PGPASSWORD" => u.password,
                 "PGHOST" => u.host,
                 "PGPORT" => u.port.to_s,
                 "PGNAME" => db_name ,
                 "AWS_ACCESS_KEY_ID" => ENV['AWS_ACCESS_KEY_ID'],
                 "AWS_SECRET_ACCESS_KEY" => ENV['AWS_SECRET_ACCESS_KEY'],
                 "AWS_END_POINT" => ENV['AWS_END_POINT'],
                 "BUCKET_NAME" => ENV['BUCKET_NAME']
               }, "./backup.sh" )
  res = Process.wait pid
  puts $?
end

puts "Running backups..."

ENV.keys.select { |x| x =~ /DATABASE_URL/ }.each do |key|
  backup_database( ENV[key] )
end

puts "Done"
