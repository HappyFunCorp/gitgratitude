require 'slack-ruby-client'
require 'dotenv'

Dotenv.load

if !ENV['SLACK_BOT_TOKEN']
  throw "SLACK_BOT_TOKEN not set"
end

Slack.configure do |config|
  config.token = ENV['SLACK_BOT_TOKEN']
end

user_id = "U02DAHP35"

client = Slack::Web::Client.new

p client

res = client.chat_postMessage( {channel: user_id, text: "Hello there" } )

p res
