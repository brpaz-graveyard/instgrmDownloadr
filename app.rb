# If you're using Ruby 1.9 you'll need to specifically load rubygems
require 'rubygems'

# and now load bundler with your dependencies load paths
require 'bundler/setup'

# next you'll have to do the gem requiring yourself
require 'sinatra'
require 'instagram'
require 'json'
require 'securerandom'

get '/' do
 erb :index
end

get '/terms-and-conditions' do
  'Hello world!'
end

