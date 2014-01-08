Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  var params = window.location.pathname.split('/');
  var discogsId = params[params.length - 1];

  var query = 'http://api.discogs.com/releases/' + discogsId; 

  $.getJSON(query,function(data){
    console.log(results);

    var data = results.data; 

    // cover
    $('#cover').append('<img src="' +  data.images[0].resource_url  + '">');

    // info 
    var $album_info = $('#info');     
    $album_info.find('h1').html(data.title);
    $album_info.find('h2').html(data.artists[0].name);
    $album_info.find('p').html(data.labels[0].name + ' | ' +  data.year + ' | ' + data.country + ' | ' + data.labels[0].catno);

    // fill the tracks 
    var $tracks = $('#tracks');
    for ( var ii = 0; ii < data.tracklist.length; ii++ ) {
      var track = data.tracklist[ii];
      $tracks.append('<li>' + track.position + ' | ' + track.title + '| ' + track.duration + '</li>')
    }

    var findRecordPeople = function ( discogsid ) {

      var recordQuery = new Parse.Query('Record');
      recordQuery.equalTo('discogsId',discogsid);

      var addedToCollectionQuery = new Parse.Query('RecordActivity');
      addedToCollectionQuery.equalTo('activityType','addCollection');
      addedToCollectionQuery.matchesQuery('record',recordQuery);
      addedToCollectionQuery.include('fromUser');

      addedToCollectionQuery.find({
        success:function(results){

          if ( results.length === 0 ) {
            $('#social').hide(); 
          } else {
            for ( var ii = 0; ii < results.length; ii++ ) {
              var user = results[ii].get('fromUser');
              $('#people').append('<li>' +  user.get('username') + '</li>');
            }
          }

        },
        error:function(error){
          console.log('error');
          console.log(error);
        }
      });
    };

    findRecordPeople(data.id);
  }); 
});