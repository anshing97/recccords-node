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
  var resource_url = dataObj['resource_url'];

    $.getJSON(resource_url,function(results){

      var data = {
        'discogsId': results.id,
        'resource_url': results.resource_url,
        'thumb': results.thumb, 
        'title': results.title,
        'label': results.labels[0].name,  
        'artist': results.artists[0].name,  
        'year': results.year
      };

      Parse.Cloud.run('addRecordToCollection', data, {
        success: function(result) {
          console.log('success');
          console.log(result);
          successCB();
        },
        error: function(error) {
          console.log('error');
          console.log(error);
          failCB();
        }
      });
    });
}

  