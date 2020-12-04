module ApplicationHelper
  def time_ago_nilable time
    time.nil? ? 'never' : "#{time_ago_in_words( time )} ago"
  end
end
