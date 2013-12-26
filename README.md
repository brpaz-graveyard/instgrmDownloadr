
# Instgrm Downloadr

This application allows you to batch download photos from any instagram user which you have access (public or friend).


## Install

This tool is built with ruby (1.9.3) and sinatra.
The best way to install is to use rvm and create a gemset for the application.

### Create the application gemset

Make sure you have rvm and the correct version of ruby installed.
Check https://rvm.io/rvm/install for instructions how to install rvm.

After that you can do:

```ruby
rvm use 1.9.3 # tell rvm to use your ruby version

rvm gemset create igd # create a new gemset for the application. you can use any name you want.

rvm gemset use igd # tell rvm to use that gemset.
```

### install the required gems with bundler

go to the application root folder and do:

```ruby
bundle install
```

This will install all the required gems.

### Configure instagram client

First, you need to register a new application in the instagram webste http://instagram.com/developer/clients/manage/

After that, replace the instagram gem configuration in app.rb file.

```ruby
Instagram.configure do |config|
  config.client_id      = "myclientid"
  config.client_secret  = "myclientsecret"
end
```

Also, you might need to change the ```CALLBACK_URL``` constant to match the one you defined when registering the application.


### start the application

In the application root folder do:

```ruby
ruby app.rb
```

Now you can access the application using: ```http:://localhost:4567```.



## TODO / Improvements

* This application was built using the classical style. It would be nice to create a branch using the modular style.

* Add tests


## Contributing

This is my first app developed with ruby/sintra so it might be better ways to do some things. If you think
you can make this tool better, just open a issue with your suggestions and/or create a pull request.


## Terms of use.

Instagram have a very strict terms of use. Before using the application, be sure to check http://instagram.com/legal/terms/
I have done this application for personal use and as an oportunity to learn a new language. I am not responsible for your actions using this application.

For detailed information, please see http://localhost:4567/terms-and-conditions