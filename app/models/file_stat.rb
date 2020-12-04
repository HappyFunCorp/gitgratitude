class FileStat < ApplicationRecord
  belongs_to :repository
  belongs_to :commit
end
