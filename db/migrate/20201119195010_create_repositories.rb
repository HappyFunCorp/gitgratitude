class CreateRepositories < ActiveRecord::Migration[6.0]
  def change
    create_table :repositories, id: :uuid do |t|
      t.references :project, null: false, foreign_key: true, type: :uuid
      t.string :git_url
      t.string :homepage_url
      t.string :repo_type

      t.timestamps
    end
  end
end
