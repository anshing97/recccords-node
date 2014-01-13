Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function getWants(successCB,failCB){

  Parse.Cloud.run('userWants',{'sort':'recordName'},{
    success:function(records){
      var rcrds = new Array();
      records.each(function(record){
        var rcrd = new Object();
        rcrd.recordName = record.get('recordName');
        rcrd.recordLabel = record.get('recordLabel');
        rcrd.recordArtist = record.get('recordArtist');
        rcrd.recordYear = record.get('recordYear');
        rcrd.recordThumb = record.get('recordThumb');
        rcrds.push(rcrd);
      });
      successCB(rcrds);
    },
    error:function(error){
      var result = new Object();
      result.error = error;
      failCB(result);
    }
  });
};