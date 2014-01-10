Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {


  Parse.Cloud.run('userFeed',{},{
    success:function(activities){

      $.each(activities,function(ii,activity) {

        // record information 
        var record = activity.get('record');        
        var title   = record.get('recordName');
        var artist = record.get('recordArtist');
        var thumb = record.get('recordThumb');

        // when it was added to collection 
        var times_ago = moment(activity.createdAt).fromNow();

        // user information
        var user = activity.get('fromUser');
        var username = ( user.id === Parse.User.current().id ? 'You' : user.get('username') );

        $('#feed').append('<li><a href="record/' + record.get('discogsId') + '"><img src="' + thumb + '"></a>' + username + ' added - ' + title + ' by ' + artist + ' ' + times_ago + '</li>');

      }); 
    }, 
    error:function(error){
      console.log('error');
      console.log(error);
    }
  });

 
});