#!/usr/bin/env ruby

require 'dotenv'
Dotenv.load
require 'aws-sdk-s3'
require 'digest'

class Uploader
  def self.upload_blob( data, md5 = nil )
    ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_END_POINT', 'BUCKET_NAME'].each do |key|
      throw "Set #{key}" if ENV[key].nil?
    end

    region = 'us-east-1'
    
    s3_client = Aws::S3::Client.new(access_key_id: ENV['AWS_ACCESS_KEY_ID'],
                                    secret_access_key: ENV['AWS_SECRET_ACCESS_KEY'],
                                    endpoint: "https://#{ENV['AWS_END_POINT']}",
                                    region: region)

    md5 ||= Digest::MD5.hexdigest( data )
    key = "blobs/#{md5}"
    response = s3_client.put_object(
      body: data,
      bucket: ENV['BUCKET_NAME'],
      key: key,
      acl: 'public-read'
    )

    return key
  end
end

if __FILE__ == $0
  
  p Uploader.upload_blob( "This is my string and this too" )
end
