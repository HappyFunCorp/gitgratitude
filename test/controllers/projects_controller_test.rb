require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  test "should queue out of date repository" do
    json_pure = projects :json_pure

    refute json_pure.up_to_date?

    assert_enqueued_jobs 0

    get project_path( json_pure )
    
    assert_enqueued_jobs 1

    Rails.cache.clear
  end

  test "should resync a job manually" do
    json_pure = projects :json_pure

    refute ProjectSyncJob.is_queued?( json_pure )

    json_pure.update( last_sync: Time.now )

    assert json_pure.up_to_date?
    assert_enqueued_jobs 0

    post refresh_project_path( json_pure )

    assert_enqueued_jobs 1

    Rails.cache.clear
  end
end
