require 'gems'
require 'json'

class Handler
  def run(project_name)
    result = {name: project_name}

    gems_client = Gems::Client.new
    info = gems_client.info( project_name )

    result[:homepage] = info["homepage_uri"]
    result[:downloads] = info["downloads"]
    result[:latest_version] = info["version"]
    result[:description] = info["info"]
    result[:license] = info["licenses"].to_s

    giturl = info["source_code_uri"] || ""
    if giturl == "" && info["homepage_uri"] != nil
      if info["homepage_uri"].match( /git/ )
        giturl = info["homepage_uri"]
      end
    end
    
    # TODO which are these
    if giturl && giturl != ""
      giturl.gsub!( /\/tree\/.*/, "" )
    end

    result[:git] = giturl
    result[:sha] = info["sha"]

    versions = Gems.versions project_name
    result[:releases] = []

    versions.each do |version|
      result[:releases] << {
        version: version["number"],
        created_at: version["created_at"],
        summary: version["summary"],
        description: version["description"],
        download_count: version["downloads_count"],
        prerelease: version["prerelease"],
        sha: version["sha"],
        licenses: version["licenses"]
      }
    end

    return result.to_json
  end
end
