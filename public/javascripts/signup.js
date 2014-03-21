Parse.initialize('6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2','wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE');

parseSignUp = function(uname,password,email,objectCreatedCB, objectCreatedErrorCB){

    Parse.User.signUp(uname,password, { email: email }, { 
      success: function(user) {
        $.post('/login',{userid: user.id},function(data){
          if ( data === "success" ) {
            window.location = '/recccords/';
          }
        });
      },
      error: function(user, error) {
        var result = new Object();
        result.error = 'error #' + error.code + " : " + error.message;
        objectCreatedErrorCB(result	);
      }
    });
   
};