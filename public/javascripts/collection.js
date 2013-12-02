Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function getCollection(successCB,failCB){
  // find all records for this user 
  var query = new Parse.Query('Record');
  query.equalTo("user", Parse.User.current());

  var collection = query.collection(); 

  collection.fetch({
    success: function(records) {
    	var rcrds = new Array();
     records.each(function(record){
		var rcrd = new Object();
		rcrd.recordName = record.get('recordName');
        rcrd.recordLabel = record.get('recordLabel');
        rcrd.recordArtist = record.get('recordArtist');
        rcrd.recordYear = record.get('recordYear');
		rcrds.push(rcrd);
      });
    	successCB(rcrds);
    },
    error: function(records, error) {
      var result = new Object();
      result.error = "error";
      failCB(result);
    }
  });
};