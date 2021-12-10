require 'bundler'
require 'json'

class Handler
  def run(body)
    result = {dependencies: []}

    context = Bundler::LockfileParser.new( body )

    context.specs.each do |s|
      result[:dependencies] << [s.name, s.version.to_s]
    end

    return result.to_json
  end
end
