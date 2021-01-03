require 'test_helper'

class RepositorySyncJobTest < ActiveJob::TestCase
  test "should call find_tags and find_commits" do
    mock = Minitest::Mock.new
    mock.expect :sync_and_analyze, true
    mock.expect :project, false

    Repository.stub :find, mock do
      RepositorySyncJob.perform_now 1
    end

    assert_mock mock
  end
end
