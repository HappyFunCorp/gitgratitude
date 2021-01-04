class ReleasesController < ApplicationController
  def show
    flash.now[:notice] = "Need premissions checking on releases#show"
    
    @project = Project.find( params[:project_id] )
    @release = @project.releases.find( params[:id] )
    @repo = @project.repositories.first # TODO do we really have one repo per project?
    @tag = @repo.tags.where( tag_name: @release.tag ).first

    @refresh_please = false
    if @tag.nil?
      RepositorySyncJob.queue @repo
      @refresh_please = true
    else
      @previous_tag = @tag.previous_tag

      if @previous_tag
        @commits = @repo.commits.where( "created_at > ? and created_at <= ?", @previous_tag.created_at, @tag.created_at )
      end
      
      @file_stats = @tag.commit.file_stats

      if @file_stats.count == 0
        FileStatsJob.queue @tag.commit
        @refresh_please = true
      end
    end
  end

  def version
    @project = Project.find( params[:project_id] )
    @version = params[:version]

    release = @project.releases.where( "version = ?", @version ).first

    if release
      redirect_to project_release_path( @project, release )
    else
      ProjectSyncJob.queue @project
    end
  end
end
