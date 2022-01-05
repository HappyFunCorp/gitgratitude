require 'bundler'
require 'json'
require 'cocoapods-core'

class PodfileLockParser
  def self.parse( body )

    hash = Pod::YAMLHelper.load_string( body )
    lockfile = Pod::Lockfile.new(hash)

    result = {dependencies: []}

    lockfile.pod_names.each do |name|
      result[:dependencies] << { name: name, version: lockfile.version(name).to_s}
    end

    return result
  end
end

if __FILE__ == $0
  data = File.read( "Podfile.lock" )

  require 'pp'

  pp PodfileLockParser.parse( data )
end
