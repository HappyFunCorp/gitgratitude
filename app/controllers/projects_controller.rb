class ProjectsController < ApplicationController
  def index
    @popular_projects = Project.reorder( "downloads desc" )
  end
  
  def show
    @project = Project.find params[:id]

    if !@project.up_to_date?
      ProjectSyncJob.queue @project
    end

    @queued = ProjectSyncJob.is_queued? @project

    @releases = @project.releases.reorder( "created_at desc" )
  end
end
