class CreateAuthors < ActiveRecord::Migration[6.0]
  def change
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :authors, id: :uuid do |t|
      t.string :name
      t.string :email
      t.string :github
      t.string :twitter
      t.string :timezone

      t.timestamps
    end
  end
end
