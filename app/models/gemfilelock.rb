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

  def find_project dependency
    return unless dependency.project.nil?
    
    project = Project.where( ecosystem: Ecosystem.gems, name: dependency.name ).first
    project ||= Project.new( ecosystem: Ecosystem.gems, name: dependency.name )
    
    gems_client = Gems::Client.new
    info = gems_client.info( dependency.name )

    project.homepage = info["homepage_uri"]
    project.downloads = info["downloads"]
    project.latest_version = info["version"]
    project.description =info["info"]
    project.license = info["licenses"].to_s
    project.save

    giturl = info["source_code_uri"]
    # TODO which are these
    if giturl
      giturl.gsub!( /\/tree\/.*/, "" )
      repo = project.repositories.where( git_url: giturl ).first_or_create
    end

    release = project.releases.where( version: info["version"] ).first
    release ||= project.releases.new
    release.version = info["version"]
    release.sha = info["sha"]
    release.save

    project
  end
end
