require 'sinatra'
require_relative './gem_lookup.rb'

get '/' do
  project_name = params[:package]
  if project_name
    begin
      return GemLookup.lookup( project_name )
    rescue
      halt(404, { message: "#{project_name} not found"}.to_json)
    end
  else
    "Part of <a href='https://gitgratitude.com'>gitgratitude</a>"
  end
end
