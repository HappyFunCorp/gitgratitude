require 'test_helper'

class LockfileTest < ActiveSupport::TestCase
  test "checking out a Gemfile.lock" do
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read( File.join( Rails.root, "Gemfile.lock" ) ) )
    assert lockfile.is_a?( Gemfilelock ), "Should be a Gemfilelock object"
  end

  test "checking out a package-lock.json" do 
    lockfile = Lockfile.create_from_file( "package-lock.json", File.read(File.join( Rails.root, "test/fixtures/package-lock.json" ) ) )
    assert lockfile.is_a?( Packagejsonlock ), "Should be a Packagejsonlock object"
  end

  test "unknown yarn.lock" do 
    lockfile = Lockfile.create_from_file( "yarn.lock", File.read( File.join( Rails.root, "yarn.lock" )  ) )
    assert_nil lockfile, "Shouldn't be able to part yarn.lock"
  end

  test "data_collected? false if outstanding dependancies" do
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read(File.join( Rails.root, "test/fixtures/faker/Gemfile.lock" ) ) )
    lockfile.parse

    assert lockfile.dependencies.count != 0, "Should have created dependencies"

    refute lockfile.data_collected?
  end

  test "unloaded count should show the number of dependencies not scraped" do
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read(File.join( Rails.root, "test/fixtures/faker/Gemfile.lock" ) ) )
    lockfile.parse

    assert lockfile.unscraped_dependencies == lockfile.dependencies.count, "we should have no data yet"
  end

  test "find a project for a dependency should decrease unscraped count" do
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read(File.join( Rails.root, "test/fixtures/faker/Gemfile.lock" ) ) )
    lockfile.parse

    first_dep = lockfile.dependencies.where( name: "concurrent-ruby" ).first

    VCR.use_cassette( "gems_concurrent-ruby" ) do
      first_dep.find_project
    end

    assert lockfile.unscraped_dependencies == lockfile.dependencies.count-1, "we should have found at least one dependancies"
    refute lockfile.data_collected?
  end

  test "finding all projects should have unscrapped count of 0" do
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read(File.join( Rails.root, "test/fixtures/faker/Gemfile.lock" ) ) )
    lockfile.parse

    VCR.use_cassette( "gems_faker_list" ) do
      lockfile.dependencies.reorder( "name asc" ).each do |dep|
        dep.find_project
      end
    end

    assert lockfile.unscraped_dependencies == 0, "we should have found all dependancies"
    assert lockfile.data_collected?
  end

  test "new lockfiles should have state loading" do
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read(File.join( Rails.root, "test/fixtures/faker/Gemfile.lock" ) ) )
    lockfile.parse

    assert_equal lockfile.state, :loading
  end

  test "lockfiles with project dependancies loaded but out_of_date" do
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read(File.join( Rails.root, "test/fixtures/faker/Gemfile.lock" ) ) )
    lockfile.parse

    assert_equal lockfile.state, :loading, "should be in the loading state"

    VCR.use_cassette( "gems_faker_list" ) do
      lockfile.dependencies.reorder( "name asc" ).each do |dep|
        dep.find_project
      end
    end

    assert lockfile.unscraped_dependencies == 0, "should have scraped all dependancies"
    assert_equal lockfile.out_of_date.count, 0, "should be up to date"

    assert_equal lockfile.state, :up_to_date, "should be out of date by patch only"
  end  
end
