class RepositorySyncJob < ApplicationJob
  queue_as :default

  def perform(id)
    repo = Repository.find(id)
    repo.sync_and_analyze
  end
end
