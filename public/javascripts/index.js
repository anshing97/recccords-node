Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

// exposed function 
function getParseUser (){

  var user = Parse.User.current(); 

  if ( user ) {
    var post_data = { userid: user.id, 
                      discogsToken: user.get('discogsToken'), 
                      discogsSecret: user.get('discogsSecret') };
    $.post('/login',post_data);
  }

  return user || null;
};

function parseLogOut (){  
	Parse.User.logOut();
  $.post('/logout');
  location.reload();
};

function parseUserNeedsToken () {

  var user = Parse.User.current(); 

  return !( user.get('discogsToken') || user.get('discogsSecret') ); 

}

function parseUserSaveAuthToken () {

  var user = Parse.User.current(); 

  if ( ! ( user.get('discogsToken') || user.get('discogsSecret') ) )  {

    $.get('/auth/credentials',function(data){

      if ( data.access_token && data.access_secret ) {

        user.set('discogsToken',data.access_token);
        user.set('discogsSecret',data.access_secret);

        user.save(null,{
          success: function (user) {
            console.log('save discogs token success');
          },
          error: function(user, error) {
            console.log("error saving user " + error);
          }
        });
      }

    });

  } 

}


// for node app 
$(document).ready(function() {

  var user = getParseUser(); 

  if ( user ) {  
    $('.user').show();
    $('.userless').hide(); 
    $('#greeting').html('Hello ' + user.get('username') + ' ');    
  } else {
    $('.user').hide();
    $('.userless').show(); 
  }

  $('#logout').click(function(e){
    parseLogOut(); 
    window.location = '/';
    e.preventDefault();
  });

  if ( parseUserNeedsToken() ) {
    parseUserSaveAuthToken(); 
  } else {
    $('.auth').html('- authenticated with discogs');
  }

});