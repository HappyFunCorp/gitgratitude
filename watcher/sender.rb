# examples/client/send.rb
require "cloud_events"
require "net/http"
require "uri"

throw "set K_SINK" unless ENV['K_SINK']

type = 'url.watch'
data = {url: ARGV[0] || "https://willschenk.com" }

event = CloudEvents::Event.create \
  spec_version:      "1.0",
  id:                "1234-1234-1234",
  source:            "/mycontext",
  type:              type,
  data_content_type: "application/json",
  data:              data

cloud_events_http = CloudEvents::HttpBinding.default
headers, body = cloud_events_http.encode_event event
Net::HTTP.post URI(ENV["K_SINK"]), body, headers
