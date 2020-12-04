class LockfileParseJob < ApplicationJob
  queue_as :default

  def perform(id)
    lockfile = Lockfile.find id
    lockfile.parse
  end
end
