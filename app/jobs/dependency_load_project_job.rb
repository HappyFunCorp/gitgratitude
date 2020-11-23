class DependencyLoadProjectJob < ApplicationJob
  queue_as :default

  def perform(id)
    dep = Dependency.find( id )
    Rails.logger.info "Loading project info for #{dep.name}"
    dep.find_project
  end
end
