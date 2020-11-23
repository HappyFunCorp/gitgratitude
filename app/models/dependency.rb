class Dependency < ApplicationRecord
  belongs_to :lockfile
  belongs_to :project, optional: true
  belongs_to :release, optional: true

  def find_project
    self.project = lockfile.find_project self
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
end
