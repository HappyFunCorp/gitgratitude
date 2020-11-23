require 'test_helper'

class LockfilesControllerTest < ActionDispatch::IntegrationTest
  test "set flash for known format" do
    gemfile = fixture_file_upload("#{Rails.root}/Gemfile.lock",'application/json')
    post "/lockfiles", params: { lockfile: { data: gemfile } }
    assert_response 302

    assert_equal true, flash[:error].blank?, "Flash error should not have been set"
  end

  test "set flash for unknown format" do
    yarnlock = fixture_file_upload("#{Rails.root}/yarn.lock",'application/json')
    post "/lockfiles", params: { lockfile: {data: yarnlock } }
    assert_response 302

    assert_equal false, flash[:error].blank?, "Flash error should have been set"
  end
end
