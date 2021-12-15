# Use the official lightweight Ruby image.
# https://hub.docker.com/_/ruby
FROM ruby:3.0.3

# Install production dependencies.
WORKDIR /usr/src/app
COPY Gemfile Gemfile.lock ./
ENV BUNDLE_FROZEN=true
ENV BUNDLE_FORCE_RUBY_PLATFORM=true
RUN gem install bundler && bundle install

# Copy local code to the container image.
COPY . ./

EXPOSE 3000

# Run the web service on container startup.
CMD ["ruby", "./app.rb"]
