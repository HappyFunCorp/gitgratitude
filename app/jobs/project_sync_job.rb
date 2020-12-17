class ProjectSyncJob < ApplicationJob
  queue_as :default

  def perform(id)
    project = Project.find id
    project.sync_releases
  end
end
