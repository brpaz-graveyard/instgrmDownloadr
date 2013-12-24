# If you're using Ruby 1.9 you'll need to specifically load rubygems
require 'rubygems'

# and now load bundler with your dependencies load paths
require 'bundler/setup'

# next you'll have to do the gem requiring yourself
require 'sinatra'
require "sinatra/content_for"
require 'instagram'
require 'json'
require 'securerandom'
require 'rack-flash'

# enable sessions so we can save the user access token
use Rack::Session::Cookie, :key => 'rack.session',
                           :expire_after => 86400 , # In seconds (1 day)
                           :secret => '8b0f82c6ef056fdd82f5761b540441d86442c060'

# enable the use of flash messages
# see https://github.com/treeder/rack-flash
use Rack::Flash, :accessorize => [:notice, :error,:success], :sweep => true

# configure instagram gem
CALLBACK_URL = "http://localhost:4567/oauth/callback"

Instagram.configure do |config|
  config.client_id = "5040d5170cc6421f941345455d33b550"
  config.client_secret = "3997c52afc5847848ab7a351771f20d4"
end

# home route
get '/' do

 if session[:access_token]
 	client = Instagram.client(:access_token => session[:access_token])
	@user = client.user
 end

 erb :index
end

#  search users route
post '/user/search' do
 @q = params[:q]

 @users = {}

 if @q != ''
 	client = Instagram.client(:access_token => session[:access_token])
 	@users = Instagram.user_search(@q)
 end

 erb :_user_search_result, :layout => false
end

# terms and conditions
get '/terms-and-conditions' do
 erb :terms_and_conditions
end


# instagram oauth connect
get "/oauth/connect" do
  redirect Instagram.authorize_url(:redirect_uri => CALLBACK_URL)
end

# instagram api redirects to this url
get "/oauth/callback" do
  response = Instagram.get_access_token(params[:code], :redirect_uri => CALLBACK_URL)
  
  if !response.access_token
  	flash[:error] = "An error occurred during instagram connect"
  	erb :index
  end

  session[:access_token] = response.access_token
  redirect "/"
end

get "/user/:id/feed" do

  # redirect to index if access token is not set.
  redirect to('/') unless session[:access_token]	

  client = Instagram.client(:access_token => session[:access_token])

  @media = Instagram.user_recent_media(params[:id]) 
  puts JSON.pretty_generate(@media)
  @next_page_limit = @media.pagination.next_max_id
   #page_2 = Instagram.user_recent_media(777, :max_id => page_2_max_id ) unless page_2_max_id.nil?

   erb :user_feed
  
end


