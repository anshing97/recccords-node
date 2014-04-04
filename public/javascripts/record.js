Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function getRecordFromDiscogs(discogsId,successCB){

  var query = 'http://api.discogs.com/releases/' + discogsId + '?callback=?'; 

  $.getJSON(query,function(results){
    successCB(results);
  });
};

function getUsersWithRecord(discogsId,successCB,failCB){

  Parse.Cloud.run('usersWithRecordInCollection', { 'discogsId': discogsId }, {
    success: function(users) {
      successCB(users);
    },
    error: function(error) {
      failCB(error);
    }
  });
};

function getRecordDiscogsAndUserData(discogsId,successCB,failedCB) {

  // wrap this in a jquery promise
  function callParseForUserWithRecord ( discogsId ) {

    var deferred = new $.Deferred(); 

    Parse.Cloud.run('usersWithRecordInCollection', { 'discogsId': discogsId }, {
      success: function(users) {
        deferred.resolve(users);
      },
      error: function(error) {
        deferred.reject(error);
      }
    });

    return deferred.promise(); 
  };

  // wrap this in a jquery promise
  function callParseForUserRecordStatus ( discogsId ) {

    var deferred = new $.Deferred(); 

    Parse.Cloud.run('userRecordStatus', { 'discogsId': discogsId }, {
      success: function(response) {
        deferred.resolve(response);
      },
      error: function(error) {
        deferred.reject(error);
      }
    });

    return deferred.promise(); 
  };

  // get promise from getJson 
  var discogsPromise = $.getJSON('http://api.discogs.com/releases/' + discogsId + '?callback=?');
  var collectionPromise = callParseForUserWithRecord(discogsId);
  var userStatusPromise = callParseForUserRecordStatus(discogsId);

  // make sure everything returns 
  $.when(discogsPromise,collectionPromise,userStatusPromise).done(function(discogsResult,collectionResult,userStatusResult){

    // localize the image 
    var discogsImageURL = discogsResult[0].data.images[0].uri150; 

    // wrap the params in an array 
    localizeImages([discogsImageURL]);

    // create this image first 
    discogsResult[0].data.images[0].uri150 = 'https://s3.amazonaws.com/recccords/images/vinyl-placeholder-large.png';

    // why do we need to use 0 for discogsResults? 
    // http://stackoverflow.com/questions/14878681/multiple-getjson-requests-return-differrently-within-promise    
    successCB({discogsData:discogsResult[0].data,friends:collectionResult,status:userStatusResult,image:discogsImageURL});

  }).fail(function(){
    failedCB('Call Failed');
  });

};
