class ApplicationJob < ActiveJob::Base
  # Automatically retry jobs that encountered a deadlock
  # retry_on ActiveRecord::Deadlocked

  # Most jobs are safe to ignore if the underlying records are no longer available
  # discard_on ActiveJob::DeserializationError

  around_perform do |job, block|
    Rails.cache.write( self.class.running_key( job.arguments.first ), true, expired_in: 5.minutes )
    block.call
    Rails.cache.delete( self.class.queue_key( job.arguments.first ) )
    Rails.cache.delete( self.class.running_key( job.arguments.first ) )
  end
  
  def self.queue object
    Rails.cache.fetch( queue_key( object.id ), expires_in: 5.minutes ) do
      self.perform_later( object.id ).job_id
    end
  end

  def self.is_queued? object
    Rails.cache.exist?( queue_key( object.id ) )
  end

  def self.queue_key id
    "queued:#{self.to_s}:#{id}"
  end

  def self.running_key id
    "running:#{self.to_s}:#{id}"
  end
end
