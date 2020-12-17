require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  test "newly created project should be updated from the package manager" do
    dependency = Dependency.new( lockfile: Gemfilelock.create, name: "rails", version: "6.0.3.4" )

    VCR.use_cassette( "gems_rails" ) do
      dependency.find_project
    end

    assert dependency.project != nil, "Should have created a project"

    p = dependency.project

    assert p.repositories.count != 0, "Should have created at least one repo"

    assert p.up_to_date? == false, "shouldn't have data"

    assert p.ecosystem.name == "gems", "should have the correct ecosystem set"
    refute p.homepage.blank?, "homepage should be set"
    refute p.description.blank?, "description should be set"
    refute p.latest_version.blank?, "latest version should be set"
    refute p.downloads == 0, "should have download count"
    refute p.license.blank?, "licence should be set"
  end

  test "project should load all the releases" do
    json = Project.create name: 'json', ecosystem: Ecosystem.gems

    refute json.up_to_date?

    VCR.use_cassette 'gems_json_releases' do
      json.sync_releases
    end

    assert json.up_to_date?

    assert json.releases.count > 1
  end
end
