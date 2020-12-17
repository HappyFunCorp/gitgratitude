class RepositoriesController < ApplicationController
  def new
    @repository = Repository.new
  end

  def index
    flash.now[:notice] = "Need permission checking on repositories#show"
    @repositories = Repository.all
  end

  def create
  end

  def show
    flash.now[:notice] = "Need permission checking on repositories#show"
    
    @repository = Repository.find params[:id]

    if @repository.needs_sync?
      RepositorySyncJob.queue @repository
    end

    @commits = @repository.commits
    @files = @repository.commit_files
    @distinct_file_count = @repository.commit_files.select( "filename" ).distinct.count
    @tags = @repository.tags.reorder( "created_at desc" )
    @authors = @repository.authors
    @queued = RepositorySyncJob.is_queued? @repository

    @readme = @files.where( catgegory: 'readme' )
    @lockfile = @files.where( category: 'lockfile' )

    @count_by_categories = @repository.commit_files.group( :category ).select( "count(*) as count ,category").reorder( "count desc" )
    @count_by_language = @repository.commit_files.group( :language ).select( "count(*) as count ,language").reorder( "count desc" )

    @progress = 0
    if @repository.total_commits && @repository.total_commits > 0
      @progress = ((@commits.count.to_f / @repository.total_commits.to_f) * 100).to_i
    end
  end
end
