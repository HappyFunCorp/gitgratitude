class ProjectRepository < ApplicationRecord
  belongs_to :project
  belongs_to :repository
end
