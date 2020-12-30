class HomeController < ApplicationController
  def index
    @stats = Rails.cache.fetch("top_level_stats", expires_in: 10.minutes) do
      { time: Time.now,
        projects: Project.all.count,
        releases: Release.all.count,
        repos: Repository.all.count,
        commits: Commit.all.count,
        tags: Tag.all.count,
        authors: Author.all.count,
        commit_files: CommitFile.all.count,
        file_stats: FileStat.all.count
      }
    end
  end
end
