Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {


  $('#search').submit(function(e){

    // clear the results
    $('#results').empty();

    // form query string
    var query = 'http://api.discogs.com/database/search?type=release&format=vinyl&q=' + encodeURIComponent($('input[name="search"]').val()); 

    // show the results 
    $.getJSON(query,function(data){

      // create the list first 
      $.each(data.results,function(ii,result) {
        $('#results').append('<li data-id=' +  result.id + '><a href="record/' + result.id + '"><img src="' + result.thumb + '"></a><p>' + result.title + ' | ' + result.year +  ' <a href="#" class="addCollection" data-resource="' + result.resource_url + '">Add to Collection</a></p></li>');
      });


      // fetch user colleciton records for each record
      var recordsList = $.map(data.results,function(result) {
        return {'discogsId':result.id }; 
      });

      Parse.Cloud.run('usersWithRecordInCollectionList',{ 'records':recordsList },{
        success:function(users){
          $.each(users,function(ii,user) {
            $('li[data-id="' + recordsList[ii].discogsId + '"] p').append(' | ' + user.get('username'));
          }); 
        }, 
        error: function(error){
          console.log('error');
          console.log(error);
        }
      });


    });

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
          console.log('error');
          console.log(error);
        }
      });
    });

    return false;
  });

  
});