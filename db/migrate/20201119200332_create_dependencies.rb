class CreateDependencies < ActiveRecord::Migration[6.0]
  def change
    create_table :dependencies, id: :uuid do |t|
      t.references :lockfile, type: :uuid
      t.references :project, type: :uuid
      t.references :release, type: :uuid
      t.string :name
      t.string :version
      t.string :pattern

      t.timestamps
    end
  end
end
