class CreateCommits < ActiveRecord::Migration[6.0]
  def change
    create_table :commits, id: :uuid do |t|
      t.references :repository, null: false, foreign_key: true, type: :uuid
      t.string :sha
      t.string :ticket_number
      t.string :message
      t.references :author, null: false, foreign_key: true, type: :uuid
      t.string :timezone
      t.integer :file_count
      t.integer :added_lines
      t.integer :deleted_lines

      t.timestamps
    end
  end
end
