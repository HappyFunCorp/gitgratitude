class Ecosystem < ApplicationRecord
  has_many :projects
  
  def self.gems
    eco = Ecosystem.where( name: "gems" ).first

    if eco.nil?
      eco = GemEcosystem.create( name: "gems", language_home: "https://www.ruby-lang.org/", packages_home: "https://rubygems.org/" )
    end

    eco
  end

  # Return from the database if exists, otherwise hit the backing package manager
  def lookup_project_cached name
    project = projects.where( name: name ).first

    return project if project

    lookup_project name
  end
end
