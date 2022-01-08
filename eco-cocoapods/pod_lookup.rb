require 'gems'
require 'json'
require 'semver_dialects'

class PodLookup
  def self.lookup(project_name)
    puts "#{project_name} Lookup"
    
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

      data = {
        version: version["number"],
        released: version["created_at"],
        summary: version["summary"],
        description: version["description"],
        download_count: version["downloads_count"],
        prerelease: version["prerelease"],
        sha: version["sha"],
        licenses: version["licenses"]
      }

      parse_version data

      result[:releases] << data
    end

    return result.to_json
  end

  def self.parse_version release
    semver = SemanticVersion.new release[:version]

    major = semver.prefix_segments[0] && semver.prefix_segments[0].to_s
    release[:major] = major if major

    minor = semver.prefix_segments[1] && semver.prefix_segments[1].to_s
    release[:minor] = minor || 0

    patch = semver.prefix_segments[2] && semver.prefix_segments[2].to_s
    release[:patch] = patch || 0

    suffix = semver.suffix_segments.join
    release[:suffix] = suffix if suffix
    
    release[:prerelease] = semver.pre_release?

  end    
end

if __FILE__ == $0
  require 'pp'

  project_name = "BugsnagReactNative/Core"

  result = PodLookup.lookup( project_name )

  pp JSON.parse result
end
