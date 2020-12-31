class Project < ApplicationRecord
  belongs_to :ecosystem
  has_many :releases, dependent: :destroy
  has_many :project_repositories, dependent: :destroy
  has_many :repositories, through: :project_repositories

  def up_to_date?
    !last_sync.nil? && last_sync > 24.hours.ago
  end

  def sync_releases
    ecosystem.populate_project_info self
    ecosystem.refresh_releases self
    update( last_sync: Time.now )
  end
end
