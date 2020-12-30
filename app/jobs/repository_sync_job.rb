class RepositorySyncJob < ApplicationJob
  queue_as :default

  def perform(id)
    repo = Repository.find(id)
    repo.sync_and_analyze
    if repo.project
      ProjectSyncJob.queue repo.project
    end
  end
end
