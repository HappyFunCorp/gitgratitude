class CommitFile < ApplicationRecord
  belongs_to :repository
  belongs_to :commit
end
