# Droppr
Upload files and clipboard data through a simple HTML input field to the server.
The server responds the URL from where the resource can be accessed via HTTP.

### Installation

##### Clone repository
    $ cd
    $ git clone https://github.com/sikr/droppr.git
    $ cd droppr

##### create directory
    $ mkdir www/uploads
    $ mkdir ssl

##### Set up modules and components
    $npm install
    $bower install

##### create certificate
    $ cd ssl
    $ openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes

##### adapt config file and start server
    $ cp config.dist.json config.json
    $ node js/droppr.js

