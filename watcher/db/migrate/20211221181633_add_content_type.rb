class AddContentType < ActiveRecord::Migration[6.0]
  def self.up
    add_column :poll_responses, :content_type, :string
  end

  def self.down
    add_column :poll_responses, :content_type, :string
  end
end
