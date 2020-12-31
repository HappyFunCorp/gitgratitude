class CreateProjectRepositories < ActiveRecord::Migration[6.1]
  def change
    create_table :project_repositories, id: :uuid do |t|
      t.references :project, null: false, foreign_key: true, type: :uuid
      t.references :repository, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end

    remove_column :repositories, :project_id
  end
end
