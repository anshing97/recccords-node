Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  // find all records for this user 
  var query = new Parse.Query('RecordActivity');

  // looking for add to collection activity for this user
  query.contains('activityType','addCollection');
  query.equalTo('fromUser', Parse.User.current());  
  query.descending('createdAt');

  // include the record object
  query.include('record');

  var collection = query.collection(); 

  collection.fetch({
    success: function(activities) {
      activities.each(function(activity){

        var record = activity.get('record');

        var name   = record.get('recordName');
        var label  = record.get('recordLabel');
        var artist = record.get('recordArtist');
        var year = record.get('recordYear');
        var thumb = record.get('recordThumb');

        $('#records').append('<li><a href="record/' + record.get('discogsId') + '"><img src="' + thumb + '"></a>' + name + ' | ' + artist + ' | ' + label + ' | ' + year + '</li>');

      });

    },
    error: function(records, error) {
      console.log("error");
    }

  });
});