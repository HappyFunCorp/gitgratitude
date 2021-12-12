#!/usr/bin/env ruby

Dir.glob( '/var/openfaas/secrets/*' ).each do |f|
  key = f.gsub( /.*\//, "" )
  ENV[key] = File.read( f )
  puts ENV[key]
end

['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_END_POINT', 'BUCKET_NAME'].each do |key|
  throw "Set #{key}" if ENV[key].nil?
end

region = 'us-east-1'
s3_client = Aws::S3::Client.new(access_key_id: ENV['AWS_ACCESS_KEY_ID'],
                                secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
                                endpoint: ENV['AWS_END_POINT'],
                                region: region)

file_name = "upload.rb"

response = s3_client.put_object(
  body: File.read(file_name),
  bucket: ENV['BUCKET_NAME'],
  key: file_name,
  acl: 'public-read'
)

if response.etag
  puts "Uploaded at #{response.etag}"
  exit 0
else
  puts "Not uploaded"
  exit 1
end
