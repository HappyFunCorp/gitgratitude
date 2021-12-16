#!/usr/bin/env ruby
# -*-Ruby-*-

require_relative './dir_manager.rb'

class GitProcessor
  def initialize( repo )
    @repo = repo
    @vm = VolumeManager.new
  end

  def process
    workdir_dir = @vm.dir( @repo )

    repo_dir = "#{workdir_dir}/repo"
    out_dir = "#{workdir_dir}/output"

    FileUtils.mkdir_p repo_dir
    FileUtils.mkdir_p out_dir

    system( "REPO_URL=#{@repo} REPO_DIR=#{repo_dir} OUTPUT_DIR=#{out_dir} ruby gitinfo.rb" )
    
  end
end

if __FILE__ == $0
#GitProcessor.new( "http://github.com/wschenk/willschenk.com" ).process
GitProcessor.new( "http://github.com/happyfuncorp/gitgratitude" ).process
end
