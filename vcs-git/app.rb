# require_relative './handler.rb'
require 'sinatra'
require "cloud_events"
require "net/http"
require "uri"

def send_message( type, data )
  event = CloudEvents::Event.create spec_version:      "1.0",
                                    id:                "1234-1234-1234",
                                    source:            "/vcs-git",
                                    type:              type,
                                    data_content_type: "application/json",
                                    data:              data

  cloud_events_http = CloudEvents::HttpBinding.default
  headers, body = cloud_events_http.encode_event event
  Net::HTTP.post URI(ENV['K_SINK']), body, headers
end

get '/' do
  "Hi I'm a front end"
end

post "/" do
  cloud_events_http = CloudEvents::HttpBinding.default
  event = cloud_events_http.decode_event request.env
  logger.info "Received CloudEvent: #{event.to_h}"

  if event['type'] == 'git.process'
    puts "Got a process event with data = #{event['data']}"

    send_message( 'git.done', event['data'] )
  else
    puts "Unknown event type #{event['type']}"
  end
end

get '/keys' do
  ENV.keys.collect { |key| "#{key}=#{ENV[key]}" }.join( "\n" )
end


#get '/:project_name' do |project_name|
#  Handler.new.run( project_name )
#end
