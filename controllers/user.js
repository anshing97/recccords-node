module.exports = function(){
  
  var express = require('express');
  var app = express();

  // Renders the signup page
  app.get('/signup', function(req, res) {
    res.render('signup');
  });

  // Render the login page
  app.get('/login', function(req, res) {
    res.render('login');
  });

  // get login info 
  app.post('/login', function(req, res) {

    // save the needed information     
    req.session.userid = req.body.userid; 

    if ( req.body.discogsToken && req.body.discogsSecret ) {
      req.session.oauthAccessToken = req.body.discogsToken;
      req.session.oauthAccessTokenSecret = req.body.discogsSecret;
    }

    res.send('success');
  });

  // get logout
  app.post('/logout', function(req, res) {
    console.log('post: logout: clearing ' + req.session.userid);
    req.session.userid = null; 
    req.session.oauthAccessToken = null; 
    req.session.oauthAccessTokenSecret = null;     
    res.send('success');
  });

  return app;
}();
