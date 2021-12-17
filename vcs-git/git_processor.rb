#!/usr/bin/env ruby
# -*-Ruby-*-

require_relative './volume_manager.rb'
require_relative './upload.rb'

class GitProcessor
  def initialize( repo )
    @repo = repo
    @vm = VolumeManager.new
  end

  def gitinfo
    workdir_dir = @vm.dir( @repo )

    repo_dir = "#{workdir_dir}/repo"
    out_dir = "#{workdir_dir}/output"

    FileUtils.mkdir_p repo_dir
    FileUtils.mkdir_p out_dir

    pid = spawn( {
                   "REPO_URL" => @repo,
                   "REPO_DIR" => repo_dir,
                   "OUTPUT_DIR" => out_dir
                 }, "ruby gitinfo.rb",
                 {
                   out: ["#{out_dir}/log", "w"],
                   err: [:child, :out]
                 }
               )

    status = Process.wait pid

    outkey = "repositories/#{Digest::MD5.hexdigest @repo}"

    {
      success: $?.exitstatus == 0,
      repo: @repo,
      database: "#{out_dir}/repository.sqlite",
      log: "#{out_dir}/log",
      outkey: outkey
    }
  end

  def process
    time_start = Time.now
    puts "#{time_start} #{@repo} Processing"
    ret = gitinfo

    time_end = Time.now
    puts "#{time_end} #{@repo} Processed"

    ret[:time_start] = time_start
    ret[:time_end] = time_end
    
    Uploader.upload( ret[:database], "#{ret[:outkey]}.sqlite" )
    Uploader.upload( ret[:log], "#{ret[:outkey]}.log" )

    ret[:upload_end] = Time.now
    puts "#{ret[:upload_end]} #{@repo} Uploaded"

    ret[:database] = "#{ENV['STORAGE_URL']}/#{ret[:outkey]}.sqlite"
    ret[:log] = "#{ENV['STORAGE_URL']}/#{ret[:outkey]}.log"
    
    ret
  end
    
end

if __FILE__ == $0
  p GitProcessor.new( "https://github.com/wschenk/willschenk.com" ).process
  p GitProcessor.new( "https://github.com/happyfuncorp/gitgratitude" ).process

  system( "du -sh workspace" )
end
