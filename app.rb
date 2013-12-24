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
require 'zip'

require 'uri'
require "open-uri"

# enable sessions so we can save the user access token
use Rack::Session::Cookie, :key => 'igd',
                           :expire_after => 86400 , # In seconds (1 day)
                           :secret => '8b0f82c6ef056fdd82f5761b540441d86442c060'

# enable the use of flash messages
# see https://github.com/treeder/rack-flash
use Rack::Flash, :accessorize => [:notice, :error,:success], :sweep => true

# application constants
CALLBACK_URL = "http://localhost:4567/oauth/callback"
MEDIA_ITEMS_PER_PAGE = 18
SEARCH_LIMIT = 10

# configure instagram gem
Instagram.configure do |config|
  config.client_id      = "5040d5170cc6421f941345455d33b550"
  config.client_secret  = "3997c52afc5847848ab7a351771f20d4"
end

before '/user/*' do
   # redirect to index if access token is not set.
  redirect to('/') unless session[:access_token]  
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

 unless @q.empty?
 	client = Instagram.client(:access_token => session[:access_token])
 	@users = Instagram.user_search(@q, :count => SEARCH_LIMIT)
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

  begin

    response = Instagram.get_access_token(params[:code], :redirect_uri => CALLBACK_URL)
    
    unless response.access_token
    	flash[:error] = "An error ocurred when connecting to your instagram account"
    	erb :index
    end

    session[:access_token] = response.access_token
    redirect to('/')

  rescue Exception => e
    flash[:error] = "An error ocurred when connecting to your instagram account."
    redirect to('/')
  end

end

# user feed. Displays all the images from the user.
get "/user/:id/feed" do

  begin

    client = Instagram.client(:access_token => session[:access_token])

    # prepare the options hash to be sent to the api call.
    options = { :count => MEDIA_ITEMS_PER_PAGE}
    if params[:next_max_id]
      options.merge!({ :max_id => params[:next_max_id] })
    end

    @media = Instagram.user_recent_media(params[:id], options) 
    @pagination = @media.pagination

    # if its an ajax request, we are doing pagination. return only the items view.
    if request.xhr?
       erb :_user_feed_items, :layout => false
    else
      erb :user_feed
    end

  rescue Exception => e
    erb :error, :locals => {:message => 'an errror ocurred when retrieving this users feed. Please check if you have permission to see this users content.'}
  end


end


# Downloads the selected files compressed in a zip folder.
get '/download' do

  files = params[:media]

  unless files.empty?

      file_name = "#{SecureRandom.hex}.zip"

      # creates a temporary file
      t = Tempfile.new(file_name)

      # creates a zip file containing all the selected pictures
      Zip::OutputStream.open(t.path) do |z|

        # iterates over each selected file and add to the zip.
        files.each do |file|
          uri = URI.parse(file)
      
          z.put_next_entry(File.basename(uri.path)) # get the filename
          z.print open(file).read # read the image file from the url
        end

      end

      # sends the file for download
      send_file t.path, :type => 'application/zip',
                        :disposition => 'attachment',
                        :filename => file_name
      t.close
  end

end

# handles errors
not_found do
  erb :'404'
end

