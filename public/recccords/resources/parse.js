(function() {
  var Parse;
   
  window.Parse = Parse = (function() {
    function Parse(applicationId, masterKey) {
      this.applicationId = applicationId;
      this.masterKey = masterKey;
      this.endpoint = 'https://api.parse.com/1/';
    }
    Parse.prototype.create = function(args) {
    
    	Ext.Ajax.setUseDefaultXhrHeader(false);
    	Ext.Ajax.UseDefaultXhrHeader = false;
    	console.log('create');
      return Ext.Ajax.request({
        url: this.endpoint + args.className,
        method: 'POST',
        //withCredentials: true,
    useDefaultXhrHeader: false,
        jsonData: args.object,
        success: (function(result) {
          return args.success(JSON.parse(result.responseText));
        }),
        failure: (function(response, options) {
        	return args.error(JSON.parse(response.responseText));
        	}),
        headers: {
         'X-Parse-Application-Id': this.applicationId,
         'X-Parse-REST-API-Key': this.masterKey
        }
      });
    };
    Parse.prototype.loginUser = function(args) {
    
    	Ext.Ajax.setUseDefaultXhrHeader(false);
    	Ext.Ajax.UseDefaultXhrHeader = false;
    	console.log('login');
      return Ext.Ajax.request({
        url: this.endpoint + args.className + '?username='+args.object.username+'&password='+args.object.password,
        method: 'GET',
        //withCredentials: true,
    useDefaultXhrHeader: false,
       
        success: (function(result) {
          return args.success(JSON.parse(result.responseText));
        }),
        failure: (function(response, options) {
        	return args.error(JSON.parse(response.responseText));
        	}),
        headers: {
         'X-Parse-Application-Id': this.applicationId,
         'X-Parse-REST-API-Key': this.masterKey
        }
      });
    };
    Parse.prototype.get = function(args) {
      return Ext.Ajax.request({
        url: this.endpoint + args.className + '/' + args.objectId,
        method: 'GET',
        useDefaultXhrHeader: false,
        success: (function(result) {
          return args.success(JSON.parse(result.responseText));
        }),
        error: args.error,
        headers: {
          Authorization: "Basic " + (Base64.encode(this.applicationId + ":" + this.masterKey))
        }
      });
    };
    Parse.prototype.update = function(args) {
      return Ext.Ajax.request({
        url: this.endpoint + args.className + '/' + args.objectId,
        method: 'POST',
        useDefaultXhrHeader: false,
        jsonData: args.object,
        success: (function(result) {
          return args.success(JSON.parse(result.responseText));
        }),
        error: args.error,
        headers: {
          Authorization: "Basic " + (Base64.encode(this.applicationId + ":" + this.masterKey)),
          'X-HTTP-Method-Override': 'PUT'
        }
      });
    };
    Parse.prototype["delete"] = function(args) {
      return Ext.Ajax.request({
        url: this.endpoint + args.className + '/' + args.objectId,
        method: 'POST',
        useDefaultXhrHeader: false,
        success: (function(result) {
          return args.success(JSON.parse(result.responseText));
        }),
        error: args.error,
        headers: {
          Authorization: "Basic " + (Base64.encode(this.applicationId + ":" + this.masterKey)),
          'X-HTTP-Method-Override': 'DELETE'
        }
      });
    };
    return Parse;
  })();
}).call(this);
