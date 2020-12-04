require 'test_helper'

class LockfileParseJobTest < ActiveJob::TestCase
  test "should call lockfile parse" do
    mock = Minitest::Mock.new
    mock.expect :parse, true

    Lockfile.stub :find, mock do
      LockfileParseJob.perform_now 1
    end

    assert_mock mock
  end
end
