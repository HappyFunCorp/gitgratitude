require 'test_helper'

class GemEcosystemTest < ActiveSupport::TestCase
  test "load all the releases" do
    gems = Ecosystem.gems

    VCR.use_cassette "gems_rails_releases", record: :all do
      project = gems.lookup_project "rails"

      gems.refresh_releases project

      assert project.releases.count > 1
    end
  end

  test "should update the release download counts" do
    gems = Ecosystem.gems

    VCR.use_cassette "gems_rails_releases", record: :all do
      project = gems.lookup_project "rails"

      project.releases.create( version: "5.1.2", download_count: 123 )

      gems.refresh_releases project

      version = project.releases.where( version: "5.1.2" ).first

      assert_not_equal 123, version.download_count
    end
  end
  
  test "should parse out the version number" do
    gems = Ecosystem.gems

    VCR.use_cassette "gems_rails_releases", record: :all do
      project = gems.lookup_project "rails"

      gems.refresh_releases project

      version = project.releases.where( version: "5.1.2" ).first

      assert version
      assert_equal 5, version.major_version
      assert_equal 1, version.minor_version
      assert_equal 2, version.patch
    end
  end

  test "should default to the homepage url if there's no sourcecode url" do
    gems = Ecosystem.gems

    VCR.use_cassette "gems_foreman" do
      foreman = gems.lookup_project "foreman"

      assert foreman.repositories.count > 0
      assert_equal "http://github.com/ddollar/foreman", foreman.repositories.first.git_url
    end
  end

  test "should find the commit that the release was from" do
    gems = Ecosystem.gems

    VCR.use_cassette "gems_foreman_releases" do
      foreman = gems.lookup_project "foreman"

      gems.refresh_releases foreman

      repo = foreman.repositories.first

      repo.debug = "foreman"

      # Make sure that we got some hashes
      foreman.releases.each do |release|
        assert !release.sha.blank?
      end
    end
  end

  test "hirb doesn't have a repo set in the gems metadata" do
    gems = Ecosystem.gems

    VCR.use_cassette "gems_hirb" do
      hirb = gems.lookup_project "hirb"

      repo = hirb.repositories.first

      assert_nil repo
    end
  end
end
