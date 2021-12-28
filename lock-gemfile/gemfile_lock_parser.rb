require 'bundler'
require 'json'

class GemfileLockParser
  def self.parse( body )
    result = {dependencies: []}

    context = Bundler::LockfileParser.new( body )

    context.specs.each do |s|
      result[:dependencies] << { name: s.name, version: s.version.to_s}
    end

    return result
  end
end

if __FILE__ == $0
  data = File.read( "Gemfile.lock" )

  require 'pp'

  pp GemfileLockParser.parse( data )
end
