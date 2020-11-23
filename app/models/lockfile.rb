class Lockfile < ApplicationRecord
  belongs_to :author, optional: true
  belongs_to :repository, optional: true
  belongs_to :commit, optional: true
  has_many :dependencies, dependent: :destroy

  def self.create_from_file filename, data
    case filename
    when "Gemfile.lock"
      Gemfilelock.new( data: data )
    when "package-lock.json"
      Packagejsonlock.new( data: data )
    else
      nil
    end
  end

  def out_of_date
    dependencies.joins( :project ).where( "version != projects.latest_version" )
  end

  def data_collected?
    unscraped_dependencies == 0
  end

  def queue_scraping
    dependencies.where( project_id: nil ).each do |d|
      DependencyLoadProjectJob.queue d
    end
  end

  def unscraped_dependencies
    dependencies.where( project_id: nil ).count
  end

  def queued_jobs
    dependencies.collect { |d| DependencyLoadProjectJob.is_queued?( d ) }.select { |x| x }.length
  end
end
