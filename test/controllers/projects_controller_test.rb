require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  test "should queue out of date repository" do
    json_pure = projects :json_pure

    refute json_pure.up_to_date?

    assert_enqueued_jobs 0

    get project_path( json_pure )
    
    assert_enqueued_jobs 1
  end
end
