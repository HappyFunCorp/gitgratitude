class AuthorsController < ApplicationController
  def index
    @authors_count = Author.count

    @repo_count_by_author = Author.find_by_sql "
    select count(repository_id) as repo_count, authors.id, authors.name from
    (select distinct repository_id, author_id from commits) as repo_authors, authors
    where authors.id = author_id
    group by authors.id, authors.name
    having count(repository_id) > 1
    order by repo_count 
    desc limit 50"

    @recent_repo_count_by_author = Author.find_by_sql "
    select count(repository_id) as repo_count, authors.id, authors.name from
    (select distinct repository_id, author_id from commits where commits.created_at > '#{6.months.ago}') 
    as repo_authors, authors
    where authors.id = author_id
    group by authors.id, authors.name
    having count(repository_id) > 1
    order by repo_count 
    desc limit 50"
  end

  def show
    @author = Author.find params[:id]

    @commits = @author.commits.reorder( "created_at desc" )
  end
end
