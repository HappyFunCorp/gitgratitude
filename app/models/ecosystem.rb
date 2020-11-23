class Ecosystem < ApplicationRecord
  def self.gems
    eco = Ecosystem.where( name: "gems" ).first

    if eco.nil?
      eco = Ecosystem.create( name: "gems", language_home: "https://www.ruby-lang.org/", packages_home: "https://rubygems.org/" )
    end

    eco
  end
end
