Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function searchDiscogs(releaseName,callback){

  // form query string
  var query = 'http://api.discogs.com/database/search?type=release&format=vinyl&q=' + encodeURIComponent(releaseName);

  // show the results 
  $.getJSON(query,function(data){

    // create the list first 
    var promises = $.map(data.results,function(result,ii) {

      var orig_thumb = result.thumb; 

      var filename = result.thumb.substring(result.thumb.lastIndexOf('/')+1);
      result.thumb = '/images/' + filename; 

      return parseCacheImage(orig_thumb); 
    });

    // when working with arrays, need to use apply 
    $.when.apply($,promises).done( function(){
      console.log(arguments);
      callback(data);
    });

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

    $.post('/auth/aws_image',{image_url:data.thumb},function(aws_url){

      // save the aws url into data 
      data.awsThumb = aws_url;
 
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

  $.post('/auth/aws_image',{image_url:data.thumb},function(aws_url){

    // save the aws url into data 
    data.awsThumb = aws_url;

    Parse.Cloud.run('addRecordToCollection', data, {
      success: function(result) {
        successCB(result);
      },
      error: function(error) {
        failCB(error);
      }
    });
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

  $.post('/auth/aws_image',{image_url:data.thumb},function(aws_url){

    // save the aws url into data 
    data.awsThumb = aws_url;

    Parse.Cloud.run('addRecordToWants', data, {
      success: function(result) {
        successCB(result);
      },
      error: function(error) {
        failCB(error);
      }
    });
  });
};

function parseCacheImage(url) {
  return $.post('/auth/save_image',{image_url:url}); 
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
        $('#results').append('<li data-id=' +  result.id + '><a href="record/' + result.id + '"><img src="' + result.thumb + '"></a><p>' + result.title + ' | ' + result.year +  ' <a href="#" class="addCollection" data-resource="' + result.resource_url + '">Add to Collection</a></p></li>');
      });
    });

  });  

  $('#results').on('click','a.addCollection',function(e){

    var resource_url = $(this).data('resource');

    saveToCollection({'resource_url':resource_url},function(){console.log('success'),function(){console.log('error')}});

  });
});