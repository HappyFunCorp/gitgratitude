class FileStatsJob < ApplicationJob
  queue_as :default

  def perform(commit_id)
    commit = Commit.find( commit_id )
    commit.create_file_stats
  end
end
