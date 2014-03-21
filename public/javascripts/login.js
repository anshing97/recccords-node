Parse.initialize('6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2','wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE');

// exposed function 
parseLogin = function(username, password, objectCreatedCB, objectCreatedErrorCB){
  console.log('parselogin username ' + username + ' pw ' + password);

  // log user in 
  Parse.User.logIn(username,password, {
    success: function(user) {
      objectCreatedCB('success');
    },
    error: function(user, error) {
      var result = new Object();
      result.error = 'invalid login';
      objectCreatedErrorCB(result);
    }
  });
   
};


// for node app 
$(document).ready(function(){

  // if not, show login page
  $('#login').submit(function(e){

    // get the user name and password from the form 
    var username = $(this).children('input[name="username"]').val(); 
    var password = $(this).children('input[name="password"]').val(); 

    parseLogin(username,password,function(success){
      window.location = '/';
    },function(error){
      console.log('invalid login');
    });

    e.preventDefault(); 

  }); 
});