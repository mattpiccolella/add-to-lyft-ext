var Settings = {

	// set to false for development
	ONLINE : false,
	
	UI_TIMEOUT : 2000,
		
	PROXY : 'https://stage.birdops.com/',
	CLIENT_ID : 'VaorzjmoQAtG',
	CLIENT_SECRET : 'X4t1164l_Pjywzi84OaEeJapFuAJ0gkt',
	ACCESS_TOKEN : null,
	ACCESS_TOKEN_SECRET : null,
	BASE_URL : "https://api.lyft.com/oauth/authorize",
	TOKEN_URL : "https://api.lyft.com/oauth/token",
	PROFILE_URL : "https://api.lyft.com/v1/profile",
	RESPONSE_TYPE : "code",
	SCOPE : "profile",
	STATE : "auth",
	GRANT_TYPE : "authorization_code",
	
	AUTH_STATE_LOGIN : 'login',
	AUTH_STATE_COMPLETED : 'completed',
	
	// TODO: Come up with a way to know when to referesh.
	ACCESS_TOKEN_KEY : 'accessToken',
	USER_ID_KEY : 'userID',
	PROPERTIES : [ 'accessToken', 'userID' ],
			
	properties : null,
			
	init : function(success, failure) {
		
		chrome.storage.sync.get(this.PROPERTIES, function(properties) {
			Settings.properties = properties;
			success(properties);
		});

	},

	save : function(properties, callback) {
		
		chrome.storage.sync.set(properties, function() {
			for (var key in properties) {
				Settings.properties[key] = properties[key];
			}
			if (callback){
				callback();
			}
		});

	},
	
	remove : function(callback) {

		chrome.storage.sync.remove(this.PROPERTIES, function() {
			Settings.init(function() {} );
			if (callback){
				callback();
			}
		});

	}

}

var OAuth = {
	formatAuthorizeURL : function() {
		return Settings.BASE_URL + "?client_id=" + Settings.CLIENT_ID + "&response_type=" + Settings.RESPONSE_TYPE + "&scope=" + Settings.SCOPE + "&state=" + Settings.STATE
	},

	extractURLParam : function(name, url) {
      if (!url) url = location.href;
      name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
      var regexS = "[\\?&]"+name+"=([^&#]*)";
      var regex = new RegExp( regexS );
      var results = regex.exec( url );
      return results == null ? null : results[1];
    },

    getUserID : function(callback) {		
    	chrome.identity.launchWebAuthFlow({'url': OAuth.formatAuthorizeURL(), 'interactive': true}, function(redirect_url) {
			var code = OAuth.extractURLParam('code', redirect_url);
			$.ajax({
				type: "POST",
  				url: Settings.TOKEN_URL,
  				username: Settings.CLIENT_ID,
  				password: Settings.CLIENT_SECRET,
  				data: {
  					"grant_type" : Settings.GRANT_TYPE,
  					"code" : code
  				},
  				success: function(data) {
    				var accessToken = data.access_token;
    				$.ajax({
    					type: "GET",
    					beforeSend: function (request) {
                			request.setRequestHeader("Authorization", "Bearer " + accessToken);
            			},
            			url: Settings.PROFILE_URL,
            			success: function(data) {
            				// We finally have the user idea. Let's use it.
            				var tokenData = {
            					"accessToken" : accessToken,
            					"userID" : data.id
            				};

            				Settings.save(tokenData, function() {
            					chrome.storage.sync.get(Settings.USER_ID_KEY, function(object) {
									callback(object.userID);
								});
            				});
            			}
    				});
  				}
  			});
  			// TODO: Maybe think about error handling here?
		});
    }
}