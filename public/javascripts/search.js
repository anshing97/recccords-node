Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {


  $('#search').submit(function(e){

    // clear the results
    $('#results').empty();

    // form query string
    var query = 'http://api.discogs.com/database/search?type=release&format=vinyl&q=' + encodeURIComponent($('input[name="search"]').val()); 

    // show the results 
    $.getJSON(query,function(data){
      $.each(data.results,function(ii,result) {
 
        var findUsersWithRecords = function ( result ) {

          // find the record
          var recordQuery = new Parse.Query('Record');
          recordQuery.equalTo('discogsId',result.id);

          // find who has it 
          var addedToCollectionQuery = new Parse.Query('RecordActivity');
          addedToCollectionQuery.equalTo('activityType','addCollection');
          addedToCollectionQuery.matchesQuery('record',recordQuery);
          addedToCollectionQuery.include('fromUser');

          // append user that has this record in their collection
          addedToCollectionQuery.find({
            success:function(results){
              for ( var ii = 0; ii < results.length; ii++ ) {
                var user = results[ii].get('fromUser');
                $('li[data-id="' + result.id + '"] p').append(' | ' + user.get('username'));
              }
            },
            error:function(error){
              console.log('error');
              console.log(error);
            }
          });
        };

        $('#results').append('<li data-id=' +  result.id + '><a href="record/' + result.id + '"><img src="' + result.thumb + '"></a><p>' + result.title + ' | ' + result.year +  ' <a href="#" class="addCollection" data-resource="' + result.resource_url + '">Add to Collection</a></p></li>');

        findUsersWithRecords(result);

      });
    })

    e.preventDefault(); 
  });

  $('#results').on('click','a.addCollection',function(e){

    var resource_url = $(this).data('resource');

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
        },
        error: function(error) {
          console.log('errror');
          console.log(error);
        }
      });
    });

    return false;
  });

  
});