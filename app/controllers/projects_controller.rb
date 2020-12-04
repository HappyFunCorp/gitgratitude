class ProjectsController < ApplicationController
  def index
    @popular_projects = Project.reorder( "downloads desc" ).limit( 50 )
  end
  
  def show
    @project = Project.find params[:id]
  end
end
