class LockfilesController < ApplicationController
  def index
    flash.now[:error] = "This is a debug screen"

    @lockfiles = Lockfile.all.reorder( "created_at desc" )
  end
  
  def new
    @lockfile = Lockfile.new
  end

  def create
    lockfile = params[:lockfile]
    if lockfile.nil? || lockfile[:data].nil?
      redirect_to new_lockfile_path, flash: { error: "Upload failed" }
      return
    end
    
    filename = lockfile[:data].original_filename
    data = lockfile[:data].read
    
    lockfile = Lockfile.create_from_file( filename, data )
    
    if lockfile.nil?
      redirect_to new_lockfile_path, flash: { error: "We don't parse #{filename} (yet)" }
    else
      lockfile.save
      LockfileParseJob.queue lockfile
      redirect_to lockfile_path( lockfile )
    end
  end

  def show
    flash.now[:notice] = "Need permission checking on lockfiles#show"

    @lockfile = Lockfile.find params[:id]
    @lockfile.queue_scraping

    @queued = LockfileParseJob.is_queued?( @lockfile )
    @unscraped_dependencies = @lockfile.unscraped_dependencies

    @dependencies = @lockfile.dependencies.includes( :project ).reorder( :name )
    @out_of_date = @lockfile.out_of_date.includes( :project )

    d_count = @dependencies.count
    @progress = 0
    if d_count > 0
      @progress = (d_count - @unscraped_dependencies).to_f / @dependencies.count.to_f
    end
       
    if !@queued.blank?
      render "show_unparsed"
    else
      render "show"
    end
  end
end
