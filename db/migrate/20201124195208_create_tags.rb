class CreateTags < ActiveRecord::Migration[6.0]
  def change
    create_table :tags, id: :uuid do |t|
      t.references :repository, null: false, foreign_key: true, type: :uuid
      t.string :tag_name
      t.string :version
      t.references :commit, null: true, foreign_key: true, type: :uuid
      t.string :sha
      t.integer :major_version
      t.integer :minor_version
      t.integer :patch
      t.timestamps
    end
  end
end
