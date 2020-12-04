require 'test_helper'

class EcosystemTest < ActiveSupport::TestCase
  test "Ecosystem.gems should return GemEcosystem" do
    assert Ecosystem.gems.is_a? GemEcosystem
  end

  test "A Rubygems project should return a GemEcosystems object" do
    eco = Ecosystem.gems

    VCR.use_cassette "gems_rails" do
      project = eco.lookup_project "rails"

      project.reload
      assert project.ecosystem.is_a? GemEcosystem
    end
  end
end
