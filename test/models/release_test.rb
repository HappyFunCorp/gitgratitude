require 'test_helper'

class ReleaseTest < ActiveSupport::TestCase
  test "find a tag from a release" do
    project = Project.create( ecosystem: Ecosystem.gems )
    assert project.valid?
    
    repo = project.repositories.create
    assert repo.valid?
    
    tag = repo.tags.create( version: "1.0.0", tag_name: "v1.0.0" )
    assert tag.valid?

    release = project.releases.create( version: "0.0.9" )
    release.find_tag
    assert release.tag.nil?

    release = project.releases.create( version: "1.0.0" )
    release.find_tag
    assert !release.tag.nil?
    assert_equal "v1.0.0", release.tag
  end
end

