require 'test_helper'

class RepositoryTest < ActiveSupport::TestCase
  test "should checkout the repo" do
    project = Project.create( ecosystem: Ecosystem.gems, name: "json_pure" )
    project.repositories.create( git_url: "https://github.com/flori/json" )

    # TODO

  end
end
