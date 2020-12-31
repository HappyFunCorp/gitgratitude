require 'fileutils'

class Repository < ApplicationRecord
  has_many :tags, dependent: :destroy
  has_many :commits, dependent: :destroy
  has_many :authors, -> { distinct }, through: :commits
  has_many :commit_files, through: :commits
  has_many :project_repositories, dependent: :destroy
  has_many :projects, through: :project_repositories

  WORKDIR='/tmp/gratitude'

  def project
    projects.first
  end

  def basedir
    return nil if id.nil?
    "#{WORKDIR}/#{project.ecosystem.name}"
  end

  def debug= key
    @debug = key
  end

  def workdir
    return nil if id.nil?
    return "#{basedir}/#{@debug}" if @debug
    "#{basedir}/#{id}"
  end

  def needs_sync?
    last_analysis.nil? || last_analysis < 24.hours.ago
  end

  def sync_and_analyze
    sync
    find_commits
    find_tags
    update_attribute( :last_analysis, Time.now )
  end
  
  def sync
    FileUtils.mkdir_p workdir
    if !File.exists? "#{workdir}/.git"
      Rails.logger.info "git clone #{git_url}"
      system( "cd #{workdir}; git clone #{git_url} . > /dev/null 2>&1" )
    elsif needs_sync?
      Rails.logger.info "git pull origin #{git_url}"
      system( "cd #{workdir}; git pull origin master > /dev/null 2>&1" )
    end

    total_commits = `cd #{workdir};git rev-list --all --count HEAD`.chomp
    update( last_git_sync: Time.now, total_commits: total_commits )
  end

#  def working_copy sha
#    system( "cd #{workdir}; git checkout #{sha} > /dev/null 2>&1" )
#  end

  def find_tags
    sync if needs_sync?
    
    latest_tags = `cd #{workdir};git tag --sort=-v:refname --format='%(refname:short):%(objectname):%(*objectname):%(creatordate:iso8601-strict)'`.lines.collect { |x| x.chomp }

    latest_tags.each do |tag_string|
      tag = Tag.from_tag_string self, tag_string
    end
  end

  def find_commits
    sync if needs_sync?

    added = 0
    commit = nil
    files_added = 0
    total_added = 0
    total_deleted = 0

    `cd #{workdir};git log --all --pretty=format:'|%H|%ae|%an|%aI|%s' --numstat`.each_line do |line|
      line.chomp!

      if line[0] == '|'
        md = /\|(.*?)\|(.*?)\|(.*?)\|(.*?)\|(.*)/.match( line )
        sha = md[1]
        email = md[2]
        name = md[3]
        date = md[4]
        summary = md[5]

        commit = commits.where( sha: md[1] ).first

        if !commit.nil?
          return added
        end

        added += 1

        zone = Time.parse( date ).strftime( '%z' )

        author = Author.where( email: email ).first_or_create
        author.name = name
        author.timezone ||= zone
        author.save

        files_added = 0
        total_added = 0
        total_deleted = 0


        commit = commits.create( sha: sha, author: author, message: summary, created_at: date, timezone: zone )
      elsif line.length != 0
        md = /([\d|-]*)\s*([\d|-]*)\s*(.*)/.match( line )
        added_lines = md[1]
        deleted_lines = md[2]
        filename = md[3]

        cf = commit.commit_files.create( repository: self,
                                         filename: filename,
                                         added_lines: added_lines,
                                         deleted_lines: deleted_lines,
                                         created_at: commit.created_at )

        files_added += 1
        total_added += added_lines.to_i
        total_deleted += deleted_lines.to_i 
        commit.update( file_count: files_added, added_lines: total_added, deleted_lines: total_deleted )
      end
    end

    added
  end
end
