FROM ruby:3.0.3

RUN apt-get update && apt-get install -y postgresql-client unzip curl
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install 

WORKDIR /usr/src/app
COPY Gemfile Gemfile.lock ./
ENV BUNDLE_FROZEN=true
ENV BUNDLE_FORCE_RUBY_PLATFORM=true
RUN gem install bundler && bundle install

COPY . ./

CMD ["ruby", "./app.rb"]
