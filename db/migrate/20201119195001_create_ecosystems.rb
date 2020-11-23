class CreateEcosystems < ActiveRecord::Migration[6.0]
  def change
    create_table :ecosystems, id: :uuid do |t|
      t.string :name
      t.string :type
      t.string :language_home
      t.string :packages_home

      t.timestamps
    end
  end
end
