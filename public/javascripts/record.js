Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

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


   Parse.Cloud.run('usersWithRecordInCollection', { 'discogsId': data.id }, {
      success: function(users) {

        if ( users.length > 0 ) {
          for ( var ii = 0; ii < users.length; ii++ ) {
            $('#people').append('<li>' +  users[ii].get('username') + '</li>');
          }
        } else {
          $('#social').hide();
        }

      },
      error: function(error) {
        console.log('errror');
        console.log(error);
      }
    });
  }); 
});