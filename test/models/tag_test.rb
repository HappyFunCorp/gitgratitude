require 'test_helper'

class TagTest < ActiveSupport::TestCase
  test "parse tag format and set created_at correctly" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    assert_not_nil repo.id

    tag = Tag.from_tag_string repo, "v2.3.0:92cf5c451a6ec0f3a00e291eb909e57cf38fbea4::2019-12-12T02:24:15+09:00"

    assert_not_nil tag.id

    assert_equal "v2.3.0", tag.tag_name
    assert_equal "92cf5c451a6ec0f3a00e291eb909e57cf38fbea4", tag.sha
    assert_equal Time.iso8601( "2019-12-12T02:24:15+09:00" ), tag.created_at

    assert_equal "2.3.0", tag.version
    assert_equal 2, tag.major_version
    assert_equal 3, tag.minor_version
    assert_equal 0, tag.patch
  end

  test "parsing our an annotated tag correctly" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    assert_not_nil repo.id

    tag = Tag.from_tag_string repo, "v1.5.0:655f591dd003ec3265464e8c9e1d9a2ca2a3ff92:0b15820e245f4048d1bcd29cd60693e4e211ab43:2011-01-22T22:11:59+01:00"
    
    assert_not_nil tag.id

    assert_equal "v1.5.0", tag.tag_name
    assert_equal "0b15820e245f4048d1bcd29cd60693e4e211ab43", tag.sha
    assert_equal 1, tag.major_version
    assert_equal 5, tag.minor_version
    assert_equal 0, tag.patch
  end

  test "find tag version" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    repo.find_commits
    repo.find_tags

    tag = repo.tags.where( version: "2.3.1" ).first

    assert_not_nil tag
    assert "2.3.0", tag.previous_patch.version
    assert_not_nil tag.commit

    tag = repo.tags.where( version: "1.8.3" ).first
    assert "1.8.2", tag.previous_patch.version
    assert "1.8.6", tag.highest_patch.version
    assert_not_nil tag.commit

    tag = repo.tags.where( version: "2.0.1" ).first
    prev_tag = tag.previous_tag

    assert "2.0.0", prev_tag.version
    assert "1.8.6", prev_tag.previous_tag.version
    assert_nil prev_tag.previous_patch
    assert_not_nil tag.commit
  end

  test "2.0.9 should be the previous tag of 2.0.10" do
    repo = repositories :flori_json

    repo.tags.create( version: "2.0.1" )
    repo.tags.create( version: "2.0.2" )
    repo.tags.create( version: "2.0.9" )
    repo.tags.create( version: "2.0.10" )
    repo.tags.create( version: "2.0.11" )

    ten = repo.tags.where( version: "2.0.10" ).first

    prev = ten.previous_tag

    assert_equal "2.0.9", prev.version
  end
end
