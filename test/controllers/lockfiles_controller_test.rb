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

  test "should queue parsing of the lockfile" do
    assert_enqueued_jobs 0
    
    gemfile = fixture_file_upload("#{Rails.root}/test/fixtures/faker/Gemfile.lock",'application/json')
    post "/lockfiles", params: { lockfile: { data: gemfile } }
    assert_response 302

    assert_enqueued_jobs 1

    follow_redirect!

    assert_match "Parsing lockfile", response.body
  end

  test "should show that there are still outstanding jobs" do
    lockfile = Lockfile.create_from_file( "Gemfile.lock", File.read(File.join( Rails.root, "test/fixtures/faker/Gemfile.lock" ) ) )
    lockfile.parse

    assert_enqueued_jobs 0

    get lockfile_path( lockfile )
    
    assert_enqueued_jobs 3

    VCR.use_cassette( 'gems_faker_controller' ) do
      lockfile.dependencies.each do |dep|
        assert DependencyLoadProjectJob.is_queued?( dep )
        DependencyLoadProjectJob.perform_now dep.id
        refute DependencyLoadProjectJob.is_queued?( dep )
      end
    end

    get response.request.fullpath

    refute_match "Parsing lockfile", response.body
    refute_match "Looking up", response.body
  end
end
