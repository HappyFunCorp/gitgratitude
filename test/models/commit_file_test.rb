require 'test_helper'

class CommitFileTest < ActiveSupport::TestCase
  test "should identity .rb as a source file" do
    commit_file = CommitFile.new filename: "lib/json/pure/generator.rb"
    commit_file.deduce_type

    assert_equal "source", commit_file.category
    assert_equal "Ruby", commit_file.language
  end

  test "should identity .c as a source file" do
    commit_file = CommitFile.new filename: "ext/json/ext/generator/generator.c"
    commit_file.deduce_type

    assert_equal "source", commit_file.category
    assert_equal "C", commit_file.language
  end

  test "should identity .h as a source file" do
    commit_file = CommitFile.new filename: "ext/json/ext/generator/generator.h"
    commit_file.deduce_type

    assert_equal "source", commit_file.category
    assert_equal "C/C++ Header", commit_file.language
  end

  test "should identity .java as a source file" do
    commit_file = CommitFile.new filename: "java/src/json/ext/Generator.java"
    commit_file.deduce_type

    assert_equal "source", commit_file.category
    assert_equal "Java", commit_file.language
  end


  test "should identity _test.rb as a test file" do
    commit_file = CommitFile.new filename: "tests/json_generator_test.rb"
    commit_file.deduce_type

    assert_equal "test", commit_file.category
    assert_equal "Ruby", commit_file.language
  end

  test "should identify Gemfile.lock as a lockfile" do
    commit_file = CommitFile.new filename: "Gemfile.lock"
    commit_file.deduce_type

    assert_equal "lockfile", commit_file.category
    assert_nil commit_file.language
  end

  test "should identity package-lock.json as a lockfile" do
    commit_file = CommitFile.new filename: "package-lock.json"
    commit_file.deduce_type

    assert_equal "lockfile", commit_file.category
  end

  test "should identify README as a readme" do
    commit_file = CommitFile.new filename: "README"
    commit_file.deduce_type

    assert_equal "readme", commit_file.category
    assert_nil commit_file.language
  end

  test "should identify README.org as a readme" do
    commit_file = CommitFile.new filename: "README.org"
    commit_file.deduce_type

    assert_equal "readme", commit_file.category
    assert_nil commit_file.language
  end

  test "should identify README.md as a readme" do
    commit_file = CommitFile.new filename: "README.md"
    commit_file.deduce_type

    assert_equal "readme", commit_file.category
    assert_equal "Markdown", commit_file.language
  end

  test "should identify CHANGELOG as changelog" do
    commit_file = CommitFile.new filename: "CHANGELOG"
    commit_file.deduce_type

    assert_equal "changelog", commit_file.category
    assert_nil commit_file.language
  end

  test "should identify CHANGELOG.md as changelog" do
    commit_file = CommitFile.new filename: "CHANGELOG.md"
    commit_file.deduce_type

    assert_equal "changelog", commit_file.category
    assert_equal "Markdown", commit_file.language
  end
end
