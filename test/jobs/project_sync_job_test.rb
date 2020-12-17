require 'test_helper'

class ProjectSyncJobTest < ActiveJob::TestCase
  test "should call sync_releases" do
    mock = Minitest::Mock.new
    mock.expect :sync_releases, true

    Project.stub :find, mock do
      ProjectSyncJob.perform_now 1
    end

    assert_mock mock
  end
end
