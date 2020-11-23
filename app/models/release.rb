class Release < ApplicationRecord
  belongs_to :project
  belongs_to :commit, optional: true
end
