require 'sinatra'
require "cloud_events"
require_relative "./poller.rb"

get '/' do
  JSON.generate( PollResponse.order( "created_at desc" ).limit(20).collect{ |o| o.to_json_hash } )
end

cloud_events_http = CloudEvents::HttpBinding.default


post "/" do
  cloud_events_http = CloudEvents::HttpBinding.default
  event = cloud_events_http.decode_event request.env
  logger.info "Received CloudEvent: #{event.to_h}"

  if event['type'] == 'url.watch'
    if event['data']['url']
      do_poll( event['data']['url'] )
    else
      puts "Got message without a url #{event.to_h}"
    end
  else
    puts "Unknown event type #{event['type']}"
  end
end

def send_message( type, data )
  event = CloudEvents::Event.create spec_version:      "1.0",
                                    id:                SecureRandom.uuid,
                                    source:            "/watcher",
                                    type:              type,
                                    data_content_type: "application/json",
                                    data:              data

  cloud_events_http = CloudEvents::HttpBinding.default
  headers, body = cloud_events_http.encode_event event
  Net::HTTP.post URI(ENV['K_SINK']), body, headers
end

def do_poll( url )
  result = PollResponse.poll url

  if( result.data_changed )
    send_message( 'url.changed', result.to_json_hash )
  end
end
