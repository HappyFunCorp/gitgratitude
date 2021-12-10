require 'sinatra'
require_relative './handler.rb'

get '/' do
  "Hello there!"
end

get '/:project_name' do |project_name|
  Handler.new.run( project_name )
end
