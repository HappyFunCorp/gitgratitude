require 'active_record'
require 'net/http'
require 'digest'
require_relative './upload.rb'

begin
  require 'dotenv/load'
rescue LoadError
end

class Url < ActiveRecord::Base
    establish_connection
end

class PollResponse < ActiveRecord::Base
    establish_connection

    belongs_to :url

    def to_json_hash
        { url: url.url,
        status_code: status,
        md5: md5,
        last_modified: url.last_modified,
        changed: data_changed,
        etag: etag,
        poll_time: created_at,
        storage_key: storage_key
        }
    end

    def self.poll uri_string
        poll_response = PollResponse.new

        uri = URI(uri_string)

        if uri.scheme != 'https' && uri.scheme != 'http'
            puts "#{uri_string} schema unsupported"
            return nil
        end

        url = Url.where( url: uri.to_s ).first || Url.new( url: uri.to_s )

        response = do_get uri, url.last_modified, url.last_etag 

        if( response.is_a?( Net::HTTPRedirection ) && !response.is_a?( Net::HTTPNotModified ) )
            poll_response.redirect = true

            puts "#{uri} Redirect #{response.code} to #{response['Location']}"
            uri = URI( response['Location'] )

            puts "#{uri} Response code #{response.code}"
            puts response.class
        
            if( response.is_a?( Net::HTTPMovedPermanently ) || response.is_a?( Net::HTTPPermanentRedirect ) )
                puts "#{uri} Perm redirect"
                url = Url.where( url: uri.to_s ).first || Url.new( url: uri.to_s )
            end
        
            response = do_get uri, url.last_modified, url.last_etag 
        end

        poll_response.status = response.code
        poll_response.etag = response['etag']

        if( response['content-type'] )
          ct = response['content-type'].split( /;\s*/ )
          poll_response.content_type = ct[0]
          poll_response.charset = ct[1]
        end

        poll_response.url = url
        url.last_poll = Time.now
        url.last_modified = response['last-modified'] if response['last-modified']
        url.last_etag = response['etag']

        if( response.is_a? Net::HTTPNotModified )
            puts "#{uri} Not modified"
            
            poll_response.data_changed = false
            
            poll_response.save
            return poll_response
        end

        if response.is_a?(Net::HTTPSuccess)
            poll_response.data_changed = true
            puts "#{uri} Success and modified"

            poll_response.md5 = Digest::MD5.hexdigest( response.body )
            url.last_md5 = poll_response.md5

            poll_response.storage_key = Uploader.upload_blob( response.body, poll_response.md5 )
            poll_response.save
        end

        return poll_response
    end

    def self.do_get uri, modified, etag
        headers = {}
        headers['If-Modified-Since'] = modified.rfc2822 if modified
        headers['If-None-Match'] = etag if modified

        puts "#{uri} Making request"
        response = Net::HTTP.get_response(uri, headers)
        puts "#{uri} Done"
        response
    end
end

if __FILE__ == $0
    ActiveRecord::Base.logger = ActiveSupport::Logger.new(STDOUT)

    ActiveRecord::Base.logger.level = 0

    pr = PollResponse.poll "https://willschenk.com/"

    p pr

    pr = PollResponse.poll "https://happyfuncorp.com"

    p pr

end
