class AddReleaseTimestampsToProjects < ActiveRecord::Migration[6.1]
  def change
    add_column :projects, :first_release, :date
    add_column :projects, :latest_release, :date
    add_column :projects, :releases_count, :integer
  end
end
