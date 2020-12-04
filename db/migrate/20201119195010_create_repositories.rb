class CreateRepositories < ActiveRecord::Migration[6.0]
  def change
    create_table :repositories, id: :uuid do |t|
      t.references :project, null: false, foreign_key: true, type: :uuid
      t.string :git_url
      t.string :homepage_url
      t.string :repo_type
      t.integer :total_commits
      t.datetime :last_git_sync
      t.datetime :last_analysis

      t.timestamps
    end
  end
end
