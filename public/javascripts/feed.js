Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  // find all records for this user 
  var query = new Parse.Query('Record');
  query.descending('createdAt');
  // include user so we can get the username 
  query.include('user');

  var collection = query.collection(); 

  collection.fetch({
    success: function(records) {
      records.each(function(record){

        var title   = record.get('recordName');
        var artist = record.get('recordArtist');
        var thumb = record.get('recordThumb');
        var user = record.get('user');
        var times_ago = moment(record.createdAt).fromNow();

        $('#feed').append('<li><img src="' + thumb + '">' + user.get('username') + ' added - ' + title + ' by ' + artist + ' ' + times_ago + '</li>');

      });

    },
    error: function(records, error) {
      console.log("error");
    }

  });
});