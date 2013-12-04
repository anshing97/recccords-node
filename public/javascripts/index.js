Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  var user = Parse.User.current(); 

  if ( user ) {  
    $('.user').show();
    $('.userless').hide(); 
    $('#greeting').html('Hello ' + user.get('username') + ' ');    
  } else {
    $('.user').hide();
    $('.userless').show(); 
  }

  $('#logout').click(function(e){
    Parse.User.logOut();
    console.log("logging out");
    $.post('/logout', function(data){
      if ( data === "success") {
        window.location = '/';
      }
    });
    e.preventDefault();
  })

})