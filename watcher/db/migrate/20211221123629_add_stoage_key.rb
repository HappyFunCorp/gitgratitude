class AddStoageKey < ActiveRecord::Migration[6.0]
  def self.up
    add_column :poll_responses, :storage_key, :string
  end

  def self.down
    remove_column :poll_responses, :storage_key, :string
  end
end
