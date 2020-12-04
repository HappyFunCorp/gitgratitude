require 'bundler'
require 'gems'

class Gemfilelock < Lockfile
  def ecosystem
    Ecosystem.gems
  end
  
  def parse
    return unless save
    
    context = Bundler::LockfileParser.new( data )

    context.specs.each do |spec|
      pattern = context.dependencies[spec.name]
      if pattern
        pattern = pattern.requirements_list.to_s
      end
      
      dependencies.create( name: spec.name, version: spec.version.to_s, pattern: pattern )
    end
  end
end
