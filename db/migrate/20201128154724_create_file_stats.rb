class CreateFileStats < ActiveRecord::Migration[6.0]
  def change
    create_table :file_stats, id: :uuid do |t|
      t.references :repository, null: false, foreign_key: true, type: :uuid
      t.references :commit, null: false, foreign_key: true, type: :uuid
      t.string :filename
      t.string :language
      t.integer :code_count
      t.integer :comment_count
      t.integer :blank_count

      t.timestamps
    end
  end
end
