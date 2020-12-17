class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects, id: :uuid do |t|
      t.string :name
      t.references :ecosystem, type: :uuid
      t.string :homepage
      t.text :description
      t.string :latest_version
      t.integer :downloads
      t.datetime :project_start
      t.integer :stars
      t.integer :provider_count
      t.integer :dependencies_count
      t.integer :code_contributors
      t.integer :discussion_contributors
      t.string :license
      t.datetime :last_sync
      t.timestamps
    end
  end
end
