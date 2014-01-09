Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  console.log('starting');

  var params = window.location.pathname.split('/');
  var discogsId = params[params.length - 1];

  var query = 'http://api.discogs.com/releases/' + discogsId + '?callback=?'; 

  $.getJSON(query,function(results){
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

      // exclude self 
      addedToCollectionQuery.notEqualTo('fromUser',Parse.User.current());      
      addedToCollectionQuery.equalTo('activityType','addCollection');
      addedToCollectionQuery.matchesQuery('record',recordQuery);
      addedToCollectionQuery.include('fromUser');

      addedToCollectionQuery.find().then(function(results){

        console.log('results');
        console.log(results);

        var users = $.map(results,function(activity) {
          console.log(activity);
          return activity.get('fromUser');
        });

        console.log('users is ');
        console.log(users);
      },function(error){
        console.log('error');
        console.log(error);
      });
    };

    findRecordPeople(data.id);
  }); 
});