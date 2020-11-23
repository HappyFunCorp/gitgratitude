class CreateLockfiles < ActiveRecord::Migration[6.0]
  def change
    create_table :lockfiles, id: :uuid do |t|
      t.string :type
      t.text :data
      t.references :author, null: true, foreign_key: true, type: :uuid
      t.references :repository, null: true, foreign_key: true, type: :uuid
      t.references :commit, null: true, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
