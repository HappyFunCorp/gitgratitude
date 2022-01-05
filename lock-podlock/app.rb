require 'sinatra'
require 'sinatra/json'
require_relative './podfile_lock_parser.rb'

get '/' do
  "Part of <a href='https://gitgratitude.com'>gitgratitude</a>"
end

post '/' do
  json PodfileLockParser.parse( request.body.read )
end
