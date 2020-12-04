class Tag < ApplicationRecord
  belongs_to :repository
  belongs_to :commit, optional: true

  before_save :find_commit

  def self.from_tag_string repository, string
    tag = Tag.new repository_id: repository.id
    
    md = string.match( /(.*?):(.*?):(.*?):(.*)/ )

    tag.tag_name = md[1]
    tag.sha = md[2]
    tag.sha = md[3] unless md[3].blank? # have annotated tags point to the main commit
    tag.created_at = md[4]

    return if repository.tags.where( tag_name: md[1] ).first

    version = SemVer.parse_rubygems tag.tag_name

    tag.version = [ version.major,
                        version.minor,
                        version.patch,
                        version.special ].select { |x|
      !x.blank?
    }.join( "." )

    tag.major_version = version.major
    tag.minor_version = version.minor
    tag.patch = version.patch

    tag.save

    tag
  end

  def find_commit
    if repository && !commit
      self.commit = repository.commits.where( sha: sha ).first
    end
    self.commit
  end

  def previous_patch
    repository.tags.where( "major_version = ? and minor_version = ? and patch < ? ", major_version, minor_version, patch ).order( "patch asc" ).first
  end

  def previous_tag
    repository.tags.reorder( "version desc" ).where( "version < ?", version ).first
  end

  def highest_patch
    repository.tags.where( "major_version = ? and minor_version = ?", major_version, minor_version ).order( "patch desc" ).first
  end

  def latest_readme
    nil
  end

  def latest_changelog
    nil
  end

  def authors
    prev = previous_tag
    if prev.nil?
      return Author.limit(0)
    end

    authors = repository.commits.where( "created_at > ? and created_at <= ?", prev.created_at, created_at ).distinct(:author_id ).pluck( :author_id )
    Author.where( "id in (?)", authors )
  end
end
