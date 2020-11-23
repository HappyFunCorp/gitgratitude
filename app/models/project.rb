class Project < ApplicationRecord
  belongs_to :ecosystem
  has_many :repositories, dependent: :destroy
  has_many :releases, dependent: :destroy

  def up_to_date?
    false
  end
end
