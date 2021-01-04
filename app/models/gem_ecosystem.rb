class GemEcosystem < Ecosystem
  def lookup_project name
    project = projects.where( name: name ).first
    project ||= projects.new( name: name )

    populate_project_info( project )
  end

  def populate_project_info( project )
    gems_client = Gems::Client.new
    info = gems_client.info( project.name )

    project.homepage = info["homepage_uri"]
    project.downloads = info["downloads"]
    project.latest_version = info["version"]
    project.description =info["info"]
    project.license = info["licenses"].to_s
    project.save

    giturl = info["source_code_uri"]
    if giturl.blank? && !info["homepage_uri"].blank?
      if info["homepage_uri"].match( /git/ )
        giturl = info["homepage_uri"]
      end
    end
    
    # TODO which are these
    if giturl && !giturl.blank?
      giturl.gsub!( /\/tree\/.*/, "" )
      repo = Repository.where( git_url: giturl ).first_or_create

      if project.repositories.where( id: repo.id ).count == 0
        project.repositories << repo #.where( git_url: giturl ).first_or_create
      end
    end

    release = project.releases.where( version: info["version"] ).first
    release ||= project.releases.new
    release.version = info["version"]
    release.sha = info["sha"]
    release.save

    project
  end

  def refresh_releases project
    versions = Gems.versions project.name
    
    versions.each do |version|
      rel = project.releases.where( version: version["number"] ).first_or_create
      rel.update( created_at: version["created_at"],
                  summary: version["summary"],
                  description: version["description"],
                  download_count: version["downloads_count"],
                  prerelease: version["prerelease"],
                  sha: version["sha"],
                  licenses: version["licenses"] )
      rel.find_tag
    end

    project.update( first_release: project.releases.first.created_at, latest_release: project.releases.last.created_at )
    Project.reset_counters( project.id, :releases )
  end
end
