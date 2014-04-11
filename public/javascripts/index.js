Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

// exposed function 
function getParseUser (){
  return Parse.User.current(); 
};

function parseLogOut (){  
	Parse.User.logOut();
  $.post('/logout');
  location.reload();
};

// assumes user is available 
function parseCheckToken (callback) {

  var user = Parse.User.current(); 

  user.fetch().then(function(user_info){

    console.log("user info ");

    // check if the token and secret are there 
    var token = user_info.get('discogsToken');
    var secret = user_info.get('discogsSecret');

    if ( token && secret ) {

      // if we have token, log us in
      var login_data = { userid: user.id, 
                         discogsToken: token, 
                         discogsSecret: secret };

      $.post('/auth/verify',login_data,function(response){  

        // whatever is in parse doesn't work so we need to clear it 
        if ( response == true ) {

          // token is verified to work via identity 

          callback(true);

        } else {

          // token is not valid, clear what's on the database and redo the OAUTH process 

          user_info.unset('discogsToken');
          user_info.unset('discogsSecret');

          user_info.save().then(function(){
            callback(false);
          });
        }

      });

    } else {

      // check if we have credentials from oauth callback
      $.get('/auth/credentials',function(response){

        if ( response.access_token && response.access_secret ) {

          user_info.set('discogsToken',response.access_token);
          user_info.set('discogsSecret',response.access_secret);

          // user is oauthed, but data is not on parse, so save it 
          user_info.save().then(function(user){
            callback(true);
          });

        } else {

          // nothing from credential callback, lets go do oauth 
          callback(false);
        }

      });
    }
  });

};

