Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function searchDiscogs(releaseName,callback){

  // form query string
  var query = 'http://api.discogs.com/database/search?type=release&format=vinyl&q=' + encodeURIComponent(releaseName);

  // show the results 
  $.getJSON(query,function(data){
  	callback(data);
  });

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
};

function saveToCollectionWithDiscogsData(results,successCB,failCB){
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
      successCB(result);
    },
    error: function(error) {
      failCB(error);
    }
  });
};

function saveToWantsWithDiscogsData(results,successCB,failCB){
  var data = {
    'discogsId': results.id,
    'resource_url': results.resource_url,
    'thumb': results.thumb, 
    'title': results.title,
    'label': results.labels[0].name,  
    'artist': results.artists[0].name,  
    'year': results.year
  };

  Parse.Cloud.run('addRecordToWants', data, {
    success: function(result) {
      successCB(result);
    },
    error: function(error) {
      failCB(error);
    }
  });
};

function parseCacheImage(url) {


  $.post('auth/save_image',{image_url:url},function(data){
    console.log('image -----------------------')
    console.log(data);
  });
};
  
/* node app */ 
$(document).ready(function() {

  $('#search').submit(function(e){

    e.preventDefault(); 

    // clear the results
    $('#results').empty();

    var releaseName = $('input[name="search"]').val();

    searchDiscogs(releaseName, function (data) {
      // create the list first 
      $.each(data.results,function(ii,result) {


        parseCacheImage(result.thumb);

        $('#results').append('<li data-id=' +  result.id + '><a href="record/' + result.id + '"><img src="' + result.thumb + '"></a><p>' + result.title + ' | ' + result.year +  ' <a href="#" class="addCollection" data-resource="' + result.resource_url + '">Add to Collection</a></p></li>');
      });
    });

  });  
});