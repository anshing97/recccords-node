Parse.initialize("6Fj3b3fSBxz8k9mDWRHzl2uXmoSTqxleieQA4PL2", "wRXCwtc1earGjrgLfdJk9dVwilt0udunXMB3BbcE");

function searchDiscogs(releaseName,callback){
    
    // form query string
    var query = 'http://api.discogs.com/database/search?type=release&format=vinyl&q=' + encodeURIComponent(releaseName); 
	console.log('searchdiscogs ' + query);
	    // show the results 
    $.getJSON(query,function(data){
    	console.log('search query returned ' + data);
    	callback(data);
    })
};
