class CommitFile < ApplicationRecord
  belongs_to :repository
  belongs_to :commit

  before_save :deduce_type

  # Cache our type list from cloc
  def self.types
    if @types.nil?
      @types = {}
      `cloc --show-ext`.each_line do |line|
        line.chomp!
        ext,desc = line.split( /\s*->\s/ )
        @types[ext] = desc
      end
    end
    @types
  end

  def deduce_type
    CommitFile.types

    ext = filename.gsub( /.*\./, "" )
    self.language ||= CommitFile.types[ext]
      
    case filename
    when 'Gemfile.lock'
      self.category = 'lockfile'
    when 'package-lock.json'
      self.category = 'lockfile'
    when /^readme/i
      self.category = 'readme'
    when /_test\..*$/
      self.category = 'test'
    when /^changelog/i
      self.category = 'changelog'
    end

    if !self.language.nil? && self.category.nil?
      self.category = 'source'
    end
  end
end
