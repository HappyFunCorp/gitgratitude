require 'sinatra'
# require_relative './handler.rb'

get '/' do
  return "I'm ready to parse your file #{ENV['ECO_RUBYGEMS_URL']}!"
end

#get '/:project_name' do |project_name|
#  Handler.new.run( project_name )
#end
