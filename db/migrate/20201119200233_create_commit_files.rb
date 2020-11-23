class CreateCommitFiles < ActiveRecord::Migration[6.0]
  def change
    create_table :commit_files, id: :uuid do |t|
      t.references :repository, type: :uuid
      t.references :commit, type: :uuid
      t.string :filename
      t.string :file_type
      t.integer :added_lines
      t.integer :deleted_lines

      t.timestamps
    end
  end
end
