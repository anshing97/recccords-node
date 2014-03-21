Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function getCollection(successCB,failCB){

  Parse.Cloud.run('userCollection',{'sort':'recordName'},{
    success:function(records){

      var collection = $.map(records,function(record) {

        var obj = new Object();
        obj.recordName = record.get('recordName');
        obj.recordLabel = record.get('recordLabel');
        obj.recordArtist = record.get('recordArtist');
        obj.recordYear = record.get('recordYear');
        obj.recordThumb = record.get('recordThumb');
        obj.discogsId = record.get('discogsId');
        return obj; 

      });       

      successCB(collection);      
    }, 
    error:function(error){
      failCB(error);
    }
  });
};


// for node app 
$(document).ready(function() {

  getCollection(function(records){
    $.each(records,function(ii,record) {

      var name   = record.recordName;
      var label  = record.recordLabel;
      var artist = record.recordArtist;
      var year = record.recordYear;
      var thumb = record.recordThumb;

      $('#records').append('<li><a href="record/' + record.discogsId + '"><img src="' + thumb + '"></a>' + name + ' | ' + artist + ' | ' + label + ' | ' + year + '</li>');
    });       
  }, 
  function (error){
    console.log(error);
  });
});

