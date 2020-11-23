class Commit < ApplicationRecord
  belongs_to :repository
  belongs_to :author
end
