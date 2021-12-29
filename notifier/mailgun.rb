require 'mailgun-ruby'
require 'dotenv'

Dotenv.load

puts "Hello"

if !ENV['MAILGUN_API']
  throw "MAILGUN_API not set"
end


# First, instantiate the Mailgun Client with your API key
mg_client = Mailgun::Client.new ENV['MAILGUN_API']

# Define your message parameters
message_params =  { from: 'noreply@gitgratitude.com',
                    to:   'will@happyfuncorp.com',
                    subject: 'The Ruby SDK is awesome!',
                    text:    'It is really easy to send a message!'
                  }

# Send your message through the client
p mg_client.send_message 'gitgratitude.com', message_params
