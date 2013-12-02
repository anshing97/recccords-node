Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function searchDiscogs(releaseName,callback){
    
    // form query string
    var query = 'http://api.discogs.com/database/search?type=release&format=vinyl&q=' + encodeURIComponent(releaseName); 
	console.log('searchdiscogs ' + query);
	    // show the results 
    $.getJSON(query,function(data){
    	console.log('search query returned ' + data);
    	callback(data);
    })
};

function saveToCollection(dataObj,successCB,failCB){
 var createRecord = function (data) {

      // create the record 
      var Record = Parse.Object.extend('Record');
      var record = new Record(); 

      // save the relationship 
      var user_relation = record.relation('user'); 
      user_relation.add(Parse.User.current());

      record.set('discogsId',data.id);
      record.set('discogsURL',data.resource_url);
      if(data.images)
      	record.set('image',data.images[0].resource_url);
      record.set('recordName',data.title);
      record.set('recordLabel',data.labels[0].name);
      record.set('recordArtist',data.artists[0].name);
      record.set('recordYear',data.year);

      // chain via promise 
      record.save().then(function(record){
        // add the records relationship for the user 
        var user = Parse.User.current(); 
        var records_relation = user.relation('records');
        records_relation.add(record);
        //return user.save();        
      }).then(function(user){
        console.log("done saving user");
        successCB();
      },function(error){
        console.log("error saving " + error.message);
        failCB();
      });
      
    };

    var resource_url = dataObj['resource_url'];
	console.log("calling createRecord resource_url " + resource_url);
    $.getJSON(resource_url,function(data){
      createRecord(data);
    });

    return false;
  };
  