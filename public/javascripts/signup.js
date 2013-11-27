Parse.initialize('6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2','wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE');

$(document).ready(function(){

  // if not, show login page
  $('#signup').submit(function(e){

    // get the user name and password from the form 
    var username = $(this).children('input[name="username"]').val(); 
    var email    = $(this).children('input[name="email"]').val(); 
    var password = $(this).children('input[name="password"]').val(); 

    // log user in 
    Parse.User.signUp(username,password, {
      email: email
    }, { success: function(user) {
        $.post('/login',{userid: user.id},function(data){
          if ( data === "success" ) {
            window.location = '/';
          }
        });
      },
      error: function(user, error) {
        console.log('invalid login');
      }
    });
   
    e.preventDefault();
  });
});