require 'sinatra'
require 'sinatra/json'
require_relative './gemfile_lock_parser.rb'

get '/' do
  "Part of <a href='https://gitgratitude.com'>gitgratitude</a>"
end

post '/' do
  json GemfileLockParser.parse( request.body.read )
end
