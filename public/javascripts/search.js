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
        $('#results').append('<li><img src="' + result.thumb + '"><p>' + result.title + ' | ' + result.year +  ' <a href="#" data-resource="' + result.resource_url + '">Add to Collection</a></p></li>')
        console.log(result);
      });
    })

    e.preventDefault(); 
  });

  $('#results').on('click','a',function(e){

    var createRecord = function (data) {

      // create the record 
      var Record = Parse.Object.extend('Record');
      var record = new Record(); 

      // save the relationship 
      record.set('user',Parse.User.current());
      record.set('discogsId',data.id);
      record.set('discogsURL',data.resource_url);
      record.set('recordThumb',data.thumb);
      record.set('recordName',data.title);
      record.set('recordLabel',data.labels[0].name);
      record.set('recordArtist',data.artists[0].name);
      record.set('recordYear',data.year);

      // chain via promise 
      record.save(null,{
        success:function(record) {
          console.log("save succeess");
        }, 
        error:function(record,error) {
          console.log("save error");
        }
      });
      
    };

    var resource_url = $(this).data('resource');

    $.getJSON(resource_url,function(data){
      createRecord(data);
    });

    return false;
  })

});