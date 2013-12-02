Parse.initialize('6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2','wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE');

//$(document).ready(function(){

  // if not, show login page
 // $('#login').submit(function(e){
parseLogin = function(username, password, objectCreatedCB, objectCreatedErrorCB){
   console.log('parselogin username ' + username + ' pw ' + password);
    // log user in 
    Parse.User.logIn(username,password, {
      success: function(user) {
        $.post('/login',{userid: user.id},function(data){
          if ( data === "success" ) {
            window.location = '/recccords';
          }
        });
      },
      error: function(user, error) {
        console.log('invalid login');
        var result = new Object();
        result.error = 'invalid login';
        objectCreatedErrorCB(result	);
      }
    });
   
};