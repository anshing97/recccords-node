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

        $('#results').append('<li data-id=' +  result.id + '><a href="#" class="showRecord" data-resource="' + result.resource_url + '"><img src="' + result.thumb + '"></a><p>' + result.title + ' | ' + result.year +  ' <a href="#" class="addCollection" data-resource="' + result.resource_url + '">Add to Collection</a></p></li>');

        findUsersWithRecords(result);

      });
    })

    e.preventDefault(); 
  });

  $('#results').on('click','a#addCollection',function(e){

    var addToCollection = function ( data ) {

      // add to collection 
      // 1) fetch for the record   
      // 2) create or fetch the record and send result to 3 
      // 3) create a record activity with 'addCollection'

      var query = new Parse.Query('Record');
      query.equalTo('discogsId',data.id); 

      // 1) 
      query.first().then(function(record){

        // 2) 
        if ( record ) {
          return record.fetch(); 
        } else {
          var Record = Parse.Object.extend('Record');
          var new_record = new Record(); 

          // save the relationship 
          new_record.set('discogsId',data.id);
          new_record.set('discogsURL',data.resource_url);
          new_record.set('recordThumb',data.thumb);
          new_record.set('recordName',data.title);
          new_record.set('recordLabel',data.labels[0].name);
          new_record.set('recordArtist',data.artists[0].name);
          new_record.set('recordYear',data.year);

          return new_record.save(); 
        }
      }).then(function(record){

        // 3) 
        var RecordActivity = Parse.Object.extend('RecordActivity');

        var new_activity = new RecordActivity(); 

        new_activity.set('fromUser',Parse.User.current());
        new_activity.set('activityType','addCollection');
        new_activity.set('record',record);

        return new_activity.save(); 
      }).then(function(activity){
        // nothing to do on success
      },function(error){
        // error, log it 
        console.log(error);
      });
    }

    var resource_url = $(this).data('resource');

    $.getJSON(resource_url,function(data){
      addToCollection(data);
    });

    return false;
  })

  $('#results').on('click','a#showRecord',function(e){

    var resource_url = $(this).data('resource');

    $.getJSON(resource_url,function(data){
      console.log('show resource');
      console.log(data);
    });
    return false; 
  });
});