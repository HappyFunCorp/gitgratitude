#!/usr/bin/env ruby

require 'dotenv/load'
require 'aws-sdk-s3'

class Uploader
  def self.upload( local, dest )
    ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_END_POINT', 'BUCKET_NAME'].each do |key|
      throw "Set #{key}" if ENV[key].nil?
    end

    region = 'us-east-1'
    
    s3_client = Aws::S3::Client.new(access_key_id: ENV['AWS_ACCESS_KEY_ID'],
                                    secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
                                    endpoint: "https://#{ENV['AWS_END_POINT']}",
                                    region: region)
    
    response = s3_client.put_object(
      body: File.read(local),
      bucket: ENV['BUCKET_NAME'],
      key: dest,
      acl: 'public-read'
    )
  end
end

if __FILE__ == $0
  p Uploader.upload( "workspace/2021351/9ece650ace347619f51c20081c7265a5/output/repository.sqlite", "repositories/blah.sqlite" )
end
