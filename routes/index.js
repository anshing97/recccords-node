// initialize parse 
var Parse = require('parse').Parse;
Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2","wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");


// oauth module  
var OAuth = require('oauth').OAuth;
var oa = new OAuth(
  "http://api.discogs.com/oauth/request_token",
  "http://api.discogs.com/oauth/access_token",
  "BCvgSeawxoZCPYqThnPV",
  "FxEPTHDkhtqGoZGHhrQDojwgyPIEhLGm",
  "1.0",
  "http://boiling-castle-5414.herokuapp.com/auth/callback",
  "HMAC-SHA1"
);
	

// index
exports.index = function(req, res){
	console.log("index user: " + req.session.user);
  if ( req.session.user ) {
	console.log('user ouath ' + req.session.oauth);
	// check if we need oauth 
    var need_oauth = true;
    if ( req.session.oauth ) {
      need_oauth = false; 
    }

    // check if we need to save the oauth credentials 
    var need_oauth_save = true;  
    if ( req.session.user.discogsToken && req.session.user.discogsSecret ) {
      need_oauth_save = false; 
    }
	res.send({ username: req.session.user.username, 
        oauth: need_oauth, 
        saved: need_oauth_save,
      }
    );
    //res.render('index', 
     // { username: req.session.user.username, 
     //   oauth: need_oauth, 
     //   saved: need_oauth_save,
     // }
    //);

  } else {
    //res.render('login'); 
    res.send({ username: '', 
        oauth: true, 
        saved: true,
      }
    );
  }

};

// login 
exports.login = function(req, res){
  res.render('login');
};

exports.parse_login = function (request, response) {
  Parse.User.logIn(request.body.username,request.body.password, {
    success: function(user) {
      request.session.user = user;      

      // check if we have token and secrets in parse, if we do, use it 
      if ( user.get('discogsSecret') && user.get('discogsToken') ) {
        request.session.oauth = { access_token: user.get('discogsToken'), access_token_secret: user.get('discogsSecret') };        
      } 

      //response.redirect('/');
      response.send( 
      {
      	type: 'success',
      	user: request.session.user,
      	msg: 'user logged in.'
      } 
      );
    },
    error: function(user, error) {
      console.log('Error' + error.code + ' ' + error.message);
      //response.redirect('/login');
      response.send(
      {
      	type: 'fail',
      	msg: error.code + ' ' + error.message
      }  	
    	);
    }
  });
};

// signup
exports.signup = function(req, res){
  res.render('signup');
};

exports.parse_signup = function (request, response) {

  var user = new Parse.User();
  user.set('username', request.body.username);
  user.set('password', request.body.password);
  user.set('email', request.body.email);

  user.signUp(null, {
    success: function(user) {
      request.session.user = user; 
      response.send( 
      {
      	type: 'success',
      	user: request.session.user,
      	msg: 'user logged in.'
      });
    },
    error: function(user, error) {
      console.log('Error: ' + error.code + ' ' + error.message);
      response.send(
      {
      	type: 'fail',
      	msg: error.code + ' ' + error.message
      });
    }
  });
};

// save oauth credentials, requires me to get username and password again, but in iOS app we shouldn't need to do this? 

exports.save = function (req, res) {
  res.render('save');
};

exports.parse_save = function (request, response) {
  Parse.User.logIn(request.body.username,request.body.password, {
    success: function(user) {
      user.set('discogsToken',request.session.oauth.access_token);
      user.set('discogsSecret',request.session.oauth.access_token_secret);
      user.save(null, {
        success: function(user) { 
          response.redirect('/');
        }
      });
    },
    error: function(user, error) {
      console.log('Error' + error.code + ' ' + error.message);
      response.redirect('/save');
    }
  });
};


exports.oauth = function(req, res){
  oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
      res.send("yeah no. didn't work.")
    }
    else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = oauth_token_secret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
      res.redirect('http://www.discogs.com/oauth/authorize?oauth_token='+oauth_token)
  }
  });
};

exports.oauth_callback = function(req, res, next){
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    oa.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
      function(error, oauth_access_token, oauth_access_token_secret, results){
        if (error){
          console.log(error);
          res.send("yeah something broke.");
        } else {
          req.session.oauth.access_token = oauth_access_token;
          req.session.oauth.access_token_secret = oauth_access_token_secret;

          // we want to save the access token and secret into parse so we can use it for later. 
          res.redirect('/');
        }
      }
    );
  } else
    next(new Error("you're not supposed to be here."))
};

/* api calls */ 

exports.identity = function (req, res) {
  if ( req.session.oauth ) {
    oa.getProtectedResource(
      "http://api.discogs.com/oauth/identity", 
      "GET", 
      req.session.oauth.access_token, 
      req.session.oauth.access_token_secret,
      function (error, data, response) {        
        var feed = JSON.parse(data);
        req.session.access_username = feed['username'];
        console.log(req.session.access_username);
        res.send(feed); 
    });
  }
};

 
exports.user = function (req, res) {
  console.log('user access username ' + req.session.access_username); 
  if ( req.session.oauth ) {
    oa.getProtectedResource(
      "http://api.discogs.com/users/" + req.session.access_username, 
      "GET", 
      req.session.oauth.access_token, 
      req.session.oauth.access_token_secret,
      function (error, data, response) {        
        var feed = JSON.parse(data);
        res.send(feed); 
    });
  }
};

exports.collection = function (req, res) {
  if ( req.session.oauth ) {
    if ( req.session.access_username ) {
      oa.getProtectedResource(
        "http://api.discogs.com/users/" + req.session.access_username + "/collection/folders/0/releases", 
        "GET", 
        req.session.oauth.access_token, 
        req.session.oauth.access_token_secret,
        function (error, data, response) {        
          var feed = JSON.parse(data);
          res.send(feed); 
      });
    } else {
      oa.getProtectedResource(
        "http://api.discogs.com/oauth/identity", 
        "GET", 
        req.session.oauth.access_token, 
        req.session.oauth.access_token_secret,
        function (error, data, response) {        
          var feed = JSON.parse(data);
          req.session.access_username = feed['username'];
          oa.getProtectedResource(
            "http://api.discogs.com/users/" + req.session.access_username + "/collection/folders/0/releases", 
            "GET", 
            req.session.oauth.access_token, 
            req.session.oauth.access_token_secret,
            function (error, data, response) {        
              var feed = JSON.parse(data);
              res.send(feed); 
          });
      });

    }
  }
};

exports.wants = function (req, res) {

  if ( req.session.oauth ) {
    oa.getProtectedResource(
      "http://api.discogs.com/users/" + req.session.access_username + "/wants", 
      "GET", 
      req.session.oauth.access_token, 
      req.session.oauth.access_token_secret,
      function (error, data, response) {        
        var feed = JSON.parse(data);
        res.send(feed); 
    });
  }
};
