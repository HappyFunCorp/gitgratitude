require 'test_helper'

class DependencyTest < ActiveSupport::TestCase
  test "populating a dependencies" do
    refute_equal Dependency.count, 0, "Should have a few fixtures loaded into the database"
  end

  test "turbolinks" do
    turbolinks = dependencies :turbolinks

    assert_nil turbolinks.project

    VCR.use_cassette( "gems_turbolinks" ) do
      turbolinks.find_project
    end

    refute_nil turbolinks.project

    assert_equal "turbolinks", turbolinks.project.name
    assert_equal "https://github.com/turbolinks/turbolinks", turbolinks.project.homepage

    repo = turbolinks.project.repositories.first
    assert_not_nil repo, "Repository should have been set"

    assert_equal "https://github.com/turbolinks/turbolinks-rails", repo.git_url
  end

  test "should not refresh if the project is already there" do
    turbolinks = dependencies :turbolinks

    turbolinks.project = Project.create( ecosystem: Ecosystem.gems, name: "turbolinks" )

    begin VCR::Errors::UnhandledHTTPRequestError
      turbolinks.find_project
    rescue VCR::Errors::UnhandledHTTPRequestError
      assert false, "find project went to the network when the project was already loaded"
    end
  end

  test "should not have multiple projects entries of the same project" do
    t1 = Dependency.create( lockfile: Gemfilelock.new, name: "turbolinks" )

    VCR.use_cassette( "gems_turbolinks" ) do
      t1.find_project
    end

    assert t1.project.ecosystem.id == Ecosystem.gems.id, "Should have the correct ecosystem set"

    t2 = Dependency.create( lockfile: Gemfilelock.new, name: "turbolinks" )

    VCR.use_cassette( "gems_turbolinks" ) do
      t2.find_project
    end

    assert Project.where( name: "turbolinks" ).count == 1, "Should only have one project with that name"
  end
  

  test "latest version should be blank if project isn't loaded" do
    turbolinks = dependencies :turbolinks

    assert turbolinks.latest_version.blank?, "should be blank if nothing is loaded"
  end

  test "health should be blank if project isn't loaded" do
    turbolinks = dependencies :turbolinks

    assert turbolinks.health.blank?, "should be blank if nothing is loaded"
  end
end
