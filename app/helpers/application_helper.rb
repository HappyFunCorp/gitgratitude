module ApplicationHelper
  def time_ago_nilable time
    time.nil? ? 'never' : "#{time_ago_in_words( time )} ago"
  end

  def date_of date
    date.nil? ? 'na' : date.strftime( "%Y-%m-%d" )
  end
end
