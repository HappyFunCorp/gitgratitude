class LockfilesController < ApplicationController
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
      lockfile.parse
      redirect_to lockfile_path( lockfile )
    end
  end

  def show
    flash[:notice] = "Need permission checking on lockfiles#show"

    @lockfile = Lockfile.find params[:id]

    @lockfile.queue_scraping

    @dependencies = @lockfile.dependencies.includes( :project ).reorder( :name )
    @out_of_date = @lockfile.out_of_date.includes( :project )
  end
end
