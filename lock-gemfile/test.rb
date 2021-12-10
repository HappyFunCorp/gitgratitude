require_relative './handler'

data = File.read( "Gemfile.lock" )

result = Handler.new.run( data )

puts result
