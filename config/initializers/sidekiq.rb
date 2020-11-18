Rails.application.config.active_job.queue_adapter = :sidekiq
Sidekiq.configure_server do |config|
  config.redis = {url: ENV['REDIS_URL']}
end
