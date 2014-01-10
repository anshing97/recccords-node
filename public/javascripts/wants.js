Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

$(document).ready(function() {

  Parse.Cloud.run('userWants',{'sort':'recordName'},{
    success:function(records){
      $.each(records,function(ii,record) {
        var name   = record.get('recordName');
        var label  = record.get('recordLabel');
        var artist = record.get('recordArtist');
        var year = record.get('recordYear');
        var thumb = record.get('recordThumb');

        $('#records').append('<li><a href="record/' + record.get('discogsId') + '"><img src="' + thumb + '"></a>' + name + ' | ' + artist + ' | ' + label + ' | ' + year + '</li>');
      });    
    }, 
    error:function(error){
      console.log('error');
      console.log(error);
    }
  });
});
