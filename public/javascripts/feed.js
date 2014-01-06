Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  // find all records for this user 
  var query = new Parse.Query('RecordActivity');

  // looking for collection activity
  query.contains('activityType','addCollection');
  query.descending('createdAt');

  // include user and record in our data 
  query.include('fromUser');
  query.include('record');

  var collection = query.collection(); 

  collection.fetch({
    success: function(activities) {

      console.log(activities);

      activities.each(function(activity){

        // record information 
        var record = activity.get('record');        
        var title   = record.get('recordName');
        var artist = record.get('recordArtist');
        var thumb = record.get('recordThumb');

        // when it was added to collection 
        var times_ago = moment(activity.createdAt).fromNow();

        // user information
        var username = activity.get('fromUser').get('username');

        $('#feed').append('<li><img src="' + thumb + '">' + username + ' added - ' + title + ' by ' + artist + ' ' + times_ago + '</li>');

      });

    },
    error: function(records, error) {
      console.log("error");
    }

  });
});