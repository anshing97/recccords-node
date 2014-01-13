Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function getCollection(successCB,failCB){

  Parse.Cloud.run('userCollection',{'sort':'recordName'},{
    success:function(records){

      var collection = $.map(records,function(ii,record) {

        var obj = new Object();
        obj.recordName = record.get('recordName');
        obj.recordLabel = record.get('recordLabel');
        obj.recordArtist = record.get('recordArtist');
        obj.recordYear = record.get('recordYear');
        obj.recordThumb = record.get('recordThumb');
        
        return obj; 

      });       

      successCB(collection);      
    }, 
    error:function(error){
      failCB(error);
    }
  });
};