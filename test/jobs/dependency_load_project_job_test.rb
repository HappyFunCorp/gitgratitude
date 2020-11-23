require 'test_helper'

class DependencyLoadProjectJobTest < ActiveJob::TestCase
  test "should have useful fixtures" do
    turbolinks = dependencies :turbolinks

    assert turbolinks.lockfile, "Should have a lockfile"
    assert turbolinks.lockfile.is_a?( Gemfilelock ), "Should be a gem file"
  end

  test "should not be in sidekiq testing mode" do
    assert !Sidekiq::Testing.fake?, "We want to use redis!"
  end

  test "should see if a job has been queued" do
    Rails.cache.clear
    assert_enqueued_jobs 0
    
    turbolinks = dependencies :turbolinks

    refute DependencyLoadProjectJob.is_queued?( turbolinks ), "Job should not be scheduled"

    DependencyLoadProjectJob.queue turbolinks

    assert_enqueued_jobs 1
    assert DependencyLoadProjectJob.is_queued?( turbolinks ), "Job should be scheduled"
  end

  test "should only queue a job once" do
    Rails.cache.clear
    assert_enqueued_jobs 0
    
    turbolinks = dependencies :turbolinks

    refute DependencyLoadProjectJob.is_queued?( turbolinks ), "Job should not be scheduled"

    DependencyLoadProjectJob.queue turbolinks
    DependencyLoadProjectJob.queue turbolinks

    assert_enqueued_jobs 1
    assert DependencyLoadProjectJob.is_queued?( turbolinks ), "Job should be scheduled"
  end

  test "removing the queued cache item once the job is done" do
    Rails.cache.clear
    assert_enqueued_jobs 0
    
    turbolinks = dependencies :turbolinks

    refute DependencyLoadProjectJob.is_queued?( turbolinks ), "Job should not be scheduled"

    DependencyLoadProjectJob.queue turbolinks

    assert DependencyLoadProjectJob.is_queued?( turbolinks ), "Job should be scheduled"

    VCR.use_cassette( 'gems_turbolinks' ) do
      DependencyLoadProjectJob.perform_now turbolinks.id
    end

    refute DependencyLoadProjectJob.is_queued?( turbolinks ), "Job should not be scheduled"    
  end
end

