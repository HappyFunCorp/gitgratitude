# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_11_28_154724) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "authors", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "github"
    t.string "twitter"
    t.string "timezone"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "commit_files", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "repository_id"
    t.uuid "commit_id"
    t.string "filename"
    t.string "language"
    t.string "category"
    t.integer "added_lines"
    t.integer "deleted_lines"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["commit_id"], name: "index_commit_files_on_commit_id"
    t.index ["repository_id"], name: "index_commit_files_on_repository_id"
  end

  create_table "commits", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "repository_id", null: false
    t.string "sha"
    t.string "ticket_number"
    t.string "message"
    t.uuid "author_id", null: false
    t.string "timezone"
    t.integer "file_count"
    t.integer "added_lines"
    t.integer "deleted_lines"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_id"], name: "index_commits_on_author_id"
    t.index ["repository_id"], name: "index_commits_on_repository_id"
  end

  create_table "dependencies", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "lockfile_id"
    t.uuid "project_id"
    t.uuid "release_id"
    t.string "name"
    t.string "version"
    t.string "pattern"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["lockfile_id"], name: "index_dependencies_on_lockfile_id"
    t.index ["project_id"], name: "index_dependencies_on_project_id"
    t.index ["release_id"], name: "index_dependencies_on_release_id"
  end

  create_table "ecosystems", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.string "type"
    t.string "language_home"
    t.string "packages_home"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "file_stats", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "repository_id", null: false
    t.uuid "commit_id", null: false
    t.string "filename"
    t.string "language"
    t.integer "code_count"
    t.integer "comment_count"
    t.integer "blank_count"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["commit_id"], name: "index_file_stats_on_commit_id"
    t.index ["repository_id"], name: "index_file_stats_on_repository_id"
  end

  create_table "lockfiles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "type"
    t.text "data"
    t.uuid "author_id"
    t.uuid "repository_id"
    t.uuid "commit_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["author_id"], name: "index_lockfiles_on_author_id"
    t.index ["commit_id"], name: "index_lockfiles_on_commit_id"
    t.index ["repository_id"], name: "index_lockfiles_on_repository_id"
  end

  create_table "projects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.uuid "ecosystem_id"
    t.string "homepage"
    t.text "description"
    t.string "latest_version"
    t.integer "downloads"
    t.datetime "project_start"
    t.integer "stars"
    t.integer "provider_count"
    t.integer "dependencies_count"
    t.integer "code_contributors"
    t.integer "discussion_contributors"
    t.string "license"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ecosystem_id"], name: "index_projects_on_ecosystem_id"
  end

  create_table "releases", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "project_id"
    t.string "version"
    t.string "summary"
    t.string "description"
    t.integer "major_version"
    t.integer "minor_version"
    t.integer "patch"
    t.integer "download_count"
    t.boolean "prerelease"
    t.string "licenses"
    t.string "package_manager_url"
    t.string "tag"
    t.uuid "commit_id"
    t.string "sha"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["commit_id"], name: "index_releases_on_commit_id"
    t.index ["project_id"], name: "index_releases_on_project_id"
  end

  create_table "repositories", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "project_id", null: false
    t.string "git_url"
    t.string "homepage_url"
    t.string "repo_type"
    t.integer "total_commits"
    t.datetime "last_git_sync"
    t.datetime "last_analysis"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["project_id"], name: "index_repositories_on_project_id"
  end

  create_table "tags", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "repository_id", null: false
    t.string "tag_name"
    t.string "version"
    t.uuid "commit_id"
    t.string "sha"
    t.integer "major_version"
    t.integer "minor_version"
    t.integer "patch"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["commit_id"], name: "index_tags_on_commit_id"
    t.index ["repository_id"], name: "index_tags_on_repository_id"
  end

  add_foreign_key "commits", "authors"
  add_foreign_key "commits", "repositories"
  add_foreign_key "file_stats", "commits"
  add_foreign_key "file_stats", "repositories"
  add_foreign_key "lockfiles", "authors"
  add_foreign_key "lockfiles", "commits"
  add_foreign_key "lockfiles", "repositories"
  add_foreign_key "repositories", "projects"
  add_foreign_key "tags", "commits"
  add_foreign_key "tags", "repositories"
end
