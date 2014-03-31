Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function getWants(successCB,failCB){

  Parse.Cloud.run('userWants',{'sort':'recordName'},{
    success:function(records){

      var collection = $.map(records,function(record) {

        var obj = new Object();
        obj.recordName = record.get('recordName');
        obj.recordLabel = record.get('recordLabel');
        obj.recordArtist = record.get('recordArtist');
        obj.recordYear = record.get('recordYear');
        obj.recordThumb = record.get('awsThumb');
        obj.discogsId = record.get('discogsId');
        return obj; 

      });       
      
      successCB(collection);
    },
    error:function(error){
      var result = new Object();
      result.error = error;
      failCB(result);
    }
  });
};