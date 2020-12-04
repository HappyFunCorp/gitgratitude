class Commit < ApplicationRecord
  belongs_to :repository
  belongs_to :author

  has_many :commit_files, dependent: :destroy
  has_many :file_stats, dependent: :destroy

  def create_file_stats
    return if file_stats.count > 0
    
    repository.sync

    output = `cd #{repository.workdir};cloc --skip-uniqueness --quiet --by-file --csv --git #{sha} 2> /dev/null`.each_line do |line|
      language,filename,blank,comment,code = line.split( /,/ )
      if !language.blank? && language != 'SUM'
        file_stats.create( repository: repository,
                           filename: filename,
                           language: language,
                           code_count: code,
                           comment_count: comment,
                           blank_count: blank );
      end
    end
  end
end
