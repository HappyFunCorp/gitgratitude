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
    skip
  end
  
  test "should parse out the version number" do
    skip
  end

  test "populate version information" do
    skip "todo"
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

#      repo.sync_and_analyze

      # Make sure that we got some hashes
      foreman.releases.each do |release|
        assert !release.sha.blank?
      end

      
    end
    
  end

  test "should matchup tags with releases" do
    skip
  end
end
