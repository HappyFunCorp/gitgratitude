require 'test_helper'

class TagTest < ActiveSupport::TestCase
  test "parse tag format and set created_at correctly" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    assert_not_nil repo.id

    tag = Tag.from_tag_string repo, "v2.3.0:92cf5c451a6ec0f3a00e291eb909e57cf38fbea4:2019-12-12T02:24:15+09:00"

    assert_not_nil tag.id

    assert_equal "v2.3.0", tag.tag_name
    assert_equal "92cf5c451a6ec0f3a00e291eb909e57cf38fbea4", tag.sha
    assert_equal Time.iso8601( "2019-12-12T02:24:15+09:00" ), tag.created_at

    assert_equal "2.3.0", tag.version
    assert_equal 2, tag.major_version
    assert_equal 3, tag.minor_version
    assert_equal 0, tag.patch    
  end

  test "find tag version" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    repo.find_tags

    tag = repo.tags.where( version: "2.3.1" ).first

    assert_not_nil tag
    assert "2.3.0", tag.previous_patch.version

    tag = repo.tags.where( version: "1.8.3" ).first
    assert "1.8.2", tag.previous_patch.version
    assert "1.8.6", tag.highest_patch.version

    tag = repo.tags.where( version: "2.0.1" ).first
    prev_tag = tag.previous_tag

    assert "2.0.0", prev_tag.version
    assert "1.8.6", prev_tag.previous_tag.version
    assert_nil prev_tag.previous_patch
  end
end
