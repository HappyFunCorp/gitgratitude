class CreateReleases < ActiveRecord::Migration[6.0]
  def change
    create_table :releases, id: :uuid do |t|
      t.references :project, type: :uuid
      t.string :version
      t.string :summary
      t.string :description
      t.integer :major_version
      t.integer :minor_version
      t.integer :patch
      t.integer :download_count
      t.boolean :prerelease
      t.string :licenses
      t.string :package_manager_url
      t.string :tag
      t.references :commit, type: :uuid
      t.string :sha

      t.timestamps
    end
  end
end
