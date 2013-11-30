Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

//$(document).ready(function() {


function getParseUser(){
  var user = Parse.User.current(); 

  if ( user ) {  
    return user;
  } else {
   return null; 
  }
}
function parseLogOut(){
	Parse.User.logOut();
    console.log("logging out");
    $.post('/logout', function(data){
      if ( data === "success") {
        window.location = '/recccords/';
      }
    });
    e.preventDefault();
};