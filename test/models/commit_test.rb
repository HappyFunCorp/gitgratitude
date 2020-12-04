require 'test_helper'

class CommitTest < ActiveSupport::TestCase
  test "should set a working copy to a specific commit" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    repo.working_copy "dca43ea3b43f475869a4731aa3bc138be16a6e9e"

    pattern = `grep 2.0.0 #{repo.workdir}/.travis.yml`.chomp
    assert_equal "  - 2.0.0", pattern
    
    repo.working_copy "db91e90ac1375283f29e1f4a235cc7abb043c2f0"

    pattern = `grep 2.0.0 #{repo.workdir}/.travis.yml`.chomp
    assert pattern.blank?
  end
            
  test "should create filestates for a given commit" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    repo.find_commits

    assert_not_equal 0, repo.commits.count

    commit = repo.commits.where( sha: "db91e90ac1375283f29e1f4a235cc7abb043c2f0" )

    assert_not_nil commit
    p commit

    commit.create_file_stats

    assert_not_equal 0, commit.file_stats.count

    commit.file_stats.each do |x|
      printf "%20s %20s %d %d %d\n", x.filename, x.language, x.code_count, x.commit_count, x.blank_count
    end
  end
end
