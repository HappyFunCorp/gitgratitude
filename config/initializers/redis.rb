Rails.application.config.cache_store = :redis_store, ENV['REDIS_URL'],
                         { namespace: 'gratitude::cache' }
