class ProjectsController < ApplicationController
  def index
    @popular_projects = Project.reorder( "downloads desc" )
  end
  
  def show
    @project = Project.find params[:id]

    if !@project.up_to_date?
      ProjectSyncJob.queue @project
    end

    @queued = !@project.up_to_date?

    @releases = @project.releases.reorder( "created_at desc" )
  end

  def refresh
    @project = Project.find params[:id]

    ProjectSyncJob.queue @project

    redirect_to @project, flash: { notice: "Refresh queued" }
  end
end
