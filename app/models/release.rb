class Release < ApplicationRecord
  belongs_to :project, counter_cache: :releases_count
  belongs_to :commit, optional: true

  before_save :parse_version

  def find_tag
    repo = project.repositories.first

    if repo
      tag_record = repo.tags.where( version: version).first
      if tag_record
        self.tag = tag_record.tag_name
        self.commit = tag_record.commit
        save
      end
    end
  end

  def parse_version
    if !self.version.blank?
      version = SemVer.parse_rubygems self.version
      self.major_version = version.major
      self.minor_version = version.minor
      self.patch = version.patch
    end
  end
end
