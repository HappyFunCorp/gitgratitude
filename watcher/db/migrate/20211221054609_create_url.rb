class CreateUrl < ActiveRecord::Migration[6.0]
  def self.up
    create_table :urls do |t|
      t.column :url, :string, null: false
      t.column :last_poll, :datetime
      t.column :last_modified, :datetime
      t.column :last_status, :integer
      t.column :last_etag, :string
      t.column :last_md5, :string

      t.timestamps
    end

    create_table :poll_responses do |t|
      t.references :url, index: true, foreign_key: true

      t.boolean :data_changed
      t.boolean :redirect

      t.column :status, :string
      t.column :etag, :string
      t.column :md5, :string

      t.timestamps
    end
  end

  def self.down
    drop_table :logs
    drop_table :urls
    
  end
end
