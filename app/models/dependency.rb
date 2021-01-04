class Dependency < ApplicationRecord
  belongs_to :lockfile
  belongs_to :project, optional: true
  belongs_to :release, optional: true

  def find_project
    self.project = lockfile.ecosystem.lookup_project_cached self.name
    save
  end

  def latest_version
    return nil if project.nil?
    project.latest_version
  end

  def health
    return ""
    return nil if project.nil?
    project.health
  end

  def major_version
    SemVer.parse_rubygems( self.version ).major
  end

  def minor_version
    SemVer.parse_rubygems( self.version ).minor
  end
  
  def patch_version
    SemVer.parse_rubygems( self.version ).patch
  end

  def patch_upgradable?
    return false if project.nil?

    patch = project.highest_patch( major_version, minor_version )

    return false if patch.nil?

    patch.version != version
  end

  def minor_upgradable?
    return false if project.nil?
    
    minor = project.highest_minor( major_version )

    return false if minor.nil?

    minor.version != version
  end

  def major_upgradable?
    return false if project.nil?

    project.releases.reorder( "major_version desc" ).first.major_version != major_version
  end
end
