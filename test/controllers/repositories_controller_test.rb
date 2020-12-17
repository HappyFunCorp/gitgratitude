require 'test_helper'

class RepositoriesControllerTest < ActionDispatch::IntegrationTest
  test "should queue out of date repository" do
    json = repositories :flori_json

    assert json.needs_sync?

    assert_enqueued_jobs 0

    get repository_path( json )
    
    assert_enqueued_jobs 1
  end
end
