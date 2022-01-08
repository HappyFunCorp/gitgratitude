require 'sinatra'
require_relative './pod_lookup.rb'

get '/' do
  project_name = params[:package]
  if project_name
    begin
      return PodLookup.lookup( project_name )
    rescue
      halt(404, { message: "#{project_name} not found"}.to_json)
    end
  else
    "Part of <a href='https://gitgratitude.com'>gitgratitude</a>"
  end
end
