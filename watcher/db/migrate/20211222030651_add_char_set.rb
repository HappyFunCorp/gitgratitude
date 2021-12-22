class AddCharSet < ActiveRecord::Migration[6.0]
  def self.up
    add_column :poll_responses, :charset, :string
  end

  def self.down
    remove_column :poll_responses, :charset, :string
  end
end
