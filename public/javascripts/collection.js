Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  // find all records for this user 
  var query = new Parse.Query('Record');
  query.equalTo("user", Parse.User.current());

  var collection = query.collection(); 

  collection.fetch({
    success: function(records) {
      records.each(function(record){

        var name   = record.get('recordName');
        var label  = record.get('recordLabel');
        var artist = record.get('recordArtist');
        var year = record.get('recordYear');

        $('#records').append('<li>' + name + ' | ' + artist + ' | ' + label + ' | ' + year + '</li>');

      });

    },
    error: function(records, error) {
      console.log("error");
    }

  });
});