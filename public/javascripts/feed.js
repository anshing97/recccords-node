Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function getFeed(successCB,failCB){

  Parse.Cloud.run('userFeed',{},{
    success:function(activities){

      var feed = $.map(activities,function(activity) {

        // record information 
        var record = activity.get('record');  

        var obj = new Object();
        obj.recordName = record.get('recordName');
        obj.recordLabel = record.get('recordLabel');
        obj.recordArtist = record.get('recordArtist');
        obj.recordYear = record.get('recordYear');
        obj.recordThumb = record.get('recordThumb');

        // how long ago this was collected
        obj.timeAgo = moment(activity.createdAt).fromNow();
        var user = activity.get('fromUser');
        obj.username = ( user.id === Parse.User.current().id ? 'You' : user.get('username') );

        return obj;

      });

      successCB(feed) 
    }, 
    error:function(error){
      failCB(error);
    }
  });
};