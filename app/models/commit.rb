class Commit < ApplicationRecord
  belongs_to :repository
  belongs_to :author

  has_many :commit_files, dependent: :destroy
  has_many :file_stats, dependent: :destroy

  def create_file_stats
    repository.sync
    repository.working_copy sha
  end
end
