require 'test_helper'

class RepositoryTest < ActiveSupport::TestCase
  def self.xtest desc
    puts "Skipping #{desc}"
  end
    
  test "needs_sync on empty repo" do
    repo = repositories :flori_json
    assert repo.needs_sync?
  end

  test "needs_sync on repo analysed 5 minutes ago" do
    repo = repositories :flori_json
    repo.last_analysis = 5.minutes.ago
    refute repo.needs_sync?
  end

  test "needs_sync on repo synced 25 hours ago" do
    repo = repositories :flori_json
    repo.last_analysis = 25.hours.ago
    assert repo.needs_sync?
  end
    
  test "should checkout the repo" do
    repo = repositories :flori_json
    repo.last_git_sync = 25.hours.ago
    repo.debug = "json_id"

    assert_equal "/tmp/gratitude/gems/json_id", repo.workdir, "Unable to override workdir"
    assert_not_nil repo.workdir

    repo.sync if repo.needs_sync?

    assert File.exists?( "#{repo.workdir}/README.md" )
    assert_not_nil repo.last_git_sync
  end

  test "should find tags" do
    repo = repositories :flori_json
    repo.last_analysis = 25.hours.ago
    repo.debug = "json_id"

    assert repo.tags.count == 0
    assert repo.needs_sync?

    repo.find_tags

    assert repo.tags.count > 0

    first_tag_count = repo.tags.count
    repo.find_tags

    assert_equal first_tag_count, repo.tags.count, "shouldn't double create tags"
  end

  test "should populate commits" do
    repo = repositories :flori_json
    repo.last_analysis = 25.hours.ago
    repo.debug = "json_id"

    assert repo.commits.count == 0

    commits_added = repo.find_commits

    assert repo.commits.count > 0
    assert commits_added > 0

    first_commits_count = repo.commits.count

    commits_added = repo.find_commits

    assert commits_added == 0, "shouldn't have added any additional commits"

    assert_equal first_commits_count, repo.commits.count, "shouldn't double create commits"

    random_commit = repo.commits.where( sha: "17a931ab65b5a8bfe4e801a5faafbd1d9d5d5ede" ).first

    assert_not_nil random_commit
    assert_equal 2, random_commit.commit_files.count
    assert_equal "hsbt@ruby-lang.org", random_commit.author.email

    random_commit = repo.commits.where( sha: "8a18cf6a14fc1fae54b3d581434a255c9d98ceea" ).first

    assert_not_nil random_commit
    assert_equal 9, random_commit.commit_files.count
    assert_equal "jean.boussier@gmail.com", random_commit.author.email

    random_commit.commit_files.each do |file|
      refute file.filename.blank?
    end
  end

  test "updating sync and analyzing date" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    assert repo.needs_sync?
    freeze_time do
      repo.sync_and_analyze

      assert_equal Time.now, repo.last_git_sync
      assert_equal Time.now, repo.last_analysis
    end

    refute repo.needs_sync?
  end

  test "checking the total commit count" do
    repo = repositories :flori_json
    repo.debug = "json_id"

    repo.sync

    refute repo.total_commits == 0
  end
end
