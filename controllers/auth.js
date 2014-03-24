module.exports = function(){

  var CONSUMER_KEY = 'BCvgSeawxoZCPYqThnPV';
  var CONSUMER_SECRET = 'FxEPTHDkhtqGoZGHhrQDojwgyPIEhLGm';
  var USER_AGENT = 'Recccords/0.1 +http://www.recccords.com';

  // oauth module  
  var oauth = require('oauth');
  var oauth_consumer = new oauth.OAuth(
    "http://api.discogs.com/oauth/request_token",
    "http://api.discogs.com/oauth/access_token",
    CONSUMER_KEY,
    CONSUMER_SECRET,
    "1.0",
    "http://localhost:3000/auth/callback",
    "HMAC-SHA1"
  );

  var util = require('util');
  var fs = require('fs');
  var path = require('path');
  var request = require('request');

  // connect to the app 
  var express = require('express');
  var app = express();

  app.get('/connect',function(req, res){
    oauth_consumer.getOAuthRequestToken(function(error, oauthToken, oauthTokenSecret, results){
      if (error) {
        res.send("Error getting OAuth request token : " + util.inspect(error), 500);
      } else {  
        req.session.oauth = {};
        req.session.oauth.token = oauthToken;
        req.session.oauth.tokenSecret = oauthTokenSecret;

        util.puts(">> " + req.session.oauth.token);
        util.puts(">> " + req.session.oauth.tokenSecret);

        res.redirect("http://www.discogs.com/oauth/authorize?oauth_token=" + req.session.oauth.token );      
      }
    });
  });

  app.get('/callback',function(req, res){
    util.puts("<< " + req.session.oauth.token);
    util.puts("<< " + req.session.oauth.tokenSecret);
    util.puts("<< " + req.query.oauth_verifier);
    oauth_consumer.getOAuthAccessToken(req.session.oauth.token, req.session.oauth.tokenSecret, req.query.oauth_verifier, function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
      if (error) {
        res.send("Error getting OAuth access token : " + util.inspect(error) + "["+oauthAccessToken+"]"+ "["+oauthAccessTokenSecret+"]"+ "["+util.inspect(results)+"]", 500);
      } else {
        req.session.oauthAccessToken = oauthAccessToken;
        req.session.oauthAccessTokenSecret = oauthAccessTokenSecret;
        console.log("token  is: " + req.session.oauthAccessToken );
        console.log("secret is: " + req.session.oauthAccessTokenSecret );
        res.redirect('/');
      }
    });
  });

  app.get('/credentials',function(req, res) {
    res.send({ access_token: req.session.oauthAccessToken, access_secret: req.session.oauthAccessTokenSecret });
  });


  function discogs_request_options ( req, url ) {

    var options = {
      oauth: { 
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
        token: req.session.oauthAccessToken, 
        token_secret: req.session.oauthAccessTokenSecret
      }, 
      url: url, 
      headers: {
        'User-Agent': USER_AGENT
      }
    };

    return options; 
  };

  app.get('/identity',function(req, res) {

    var options = discogs_request_options(req,'http://api.discogs.com/oauth/identity');

    request.get(options, function (e,r,body) {
      res.send(body);
    }); 

  });

  app.post('/save_image',function(req, res) {

    var file_name = path.basename(req.body.image_url);
    var options = discogs_request_options(req,req.body.image_url);

    var writeStream = fs.createWriteStream('public/images/'+ file_name);
    request.get(options).pipe(writeStream);

    writeStream.on('finish',function(){
      // send back response of file's new location 
      res.send('images/' + file_name);
    })

  });

  return app; 

}(); 