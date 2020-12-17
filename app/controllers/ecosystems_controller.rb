class EcosystemsController < ApplicationController
  def index
    @ecosystems = Ecosystem.all
  end

  def show
    @ecosystem = Ecosystem.find( params[:id] )
    @projects = @ecosystem.projects.reorder( "downloads desc" )
  end
end
