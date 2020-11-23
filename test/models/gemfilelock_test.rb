require 'test_helper'

class GemfilelockTest < ActiveSupport::TestCase
  test "ecosystem existance" do
    eco = Ecosystem.where( name: "gems" ).first
    assert_not_nil eco, "Ecosystem should be set in the database"
  end
  
  test "parsing gemfile" do
    initial_d_count = Dependency.count
    
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read( File.join( Rails.root, "Gemfile.lock" ) ) )

    lockfile.parse

    refute_equal Dependency.count, initial_d_count, "Should have loaded dependencies from lockfile"

    lockfile.reload
  end

  test "finding the source repo" do
    tzinfo = Dependency.create( lockfile: Gemfilelock.create, name: "tzinfo" )

    VCR.use_cassette( "gems_tzinfo" ) do 
      tzinfo.find_project
    end

    tzinfo.reload
    
    project = tzinfo.project

    refute project.nil?, "Should have loaded a project"

    assert_equal project.homepage, "https://tzinfo.github.io"
    assert_equal project.repositories.count, 1, "Should have loaded a repository"
    assert_equal project.repositories.first.git_url, "https://github.com/tzinfo/tzinfo", "Should have parsed out the tree to find the real github url"
    assert project.releases.count > 0, "Should know about at least one release"

    release = project.releases.first

    assert_equal release.version, "2.0.3"
    assert_equal release.sha, "6f1705dd3ca4cf21fbdd1abdea8338334ef115df2e33e42a8f791b19db9765ab"
  end

  test "updating the project info" do
    tzinfo = Project.create( name: 'tzinfo', ecosystem: Ecosystem.gems, latest_version: '2.0.1' )
    tzinfo.repositories.create( git_url: 'https://github.com/tzinfo/tzinfo' )
    tzinfo.releases.create( version: '2.0.1' )

    tzinfo_dep = Dependency.create( lockfile: Gemfilelock.create, name: "tzinfo" )

    VCR.use_cassette( "gems_tzinfo" ) do 
      tzinfo_dep.find_project
    end

    tzinfo.reload

    assert_equal tzinfo.homepage, "https://tzinfo.github.io"
    assert_equal tzinfo.latest_version, '2.0.3', "Should have updated the latest version"
    assert_equal tzinfo.repositories.count, 1, "Should only have one repository"
    assert_equal tzinfo.releases.count, 2, "Should have two releases"
    assert_equal tzinfo.releases.last.version, "2.0.3"
  end
    
end
