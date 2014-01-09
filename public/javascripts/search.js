PARSE_APP_ID   = '6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2';
PARSE_CLIENT_KEY = 'wG3l0Im8wG9yjtWJmyzFElV1SyeihYW3QJzdoEyh';
PARSE_REST_KEY = 'Z2FdTJK2AS31zVmjMUkBHHp9YFwvF6jno2aAYHik';

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

    var addToCollection = function ( results ) {

      $.ajax({
        headers : {
          "X-Parse-Application-Id" : PARSE_APP_ID,
          "X-Parse-REST-API-Key" : PARSE_REST_KEY,
          "X-Parse-Session-Token" :  Parse.User.current()._sessionToken
        },
        type : "POST",        
        url : "https://api.parse.com/1/addToCollection",        
        crossDomain: true,
        processData: false,
        beforeSend: function(jqXHR) {    
            jqXHR.setRequestHeader("Content-Type", "text/plain"); 
        },
        data : {
          'discogsData': results
        },
        success: function (resp) {
          console.log(resp);
        }, 
        error: function (error) {
          console.log(error);
        }
     
      });
    };

    var resource_url = $(this).data('resource');

    $.getJSON(resource_url,function(results){
      addToCollection(results);
    });

    return false;
  });

  $('#results').on('click','a.showRecord',function(e){

    var resource_url = $(this).data('resource');

    $.getJSON(resource_url,function(data){
      console.log('show resource');
      console.log(data);
    });
    return false; 
  });
});