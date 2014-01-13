Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function getRecordFromDiscogs(discogsId,successCB){

  var query = 'http://api.discogs.com/releases/' + discogsId + '?callback=?'; 

  $.getJSON(query,function(results){
    successCB(results);
  });
};

function getUsersWithRecord(discogsId,successCB,failCB){

  Parse.Cloud.run('usersWithRecordInCollection', { 'discogsId': data.id }, {
    success: function(users) {
      successCB(users);
    },
    error: function(error) {
      failCB(error);
    }
  });
};
