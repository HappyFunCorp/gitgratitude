class Release < ApplicationRecord
  belongs_to :project
  belongs_to :commit, optional: true

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
end
