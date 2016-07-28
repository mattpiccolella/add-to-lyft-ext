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
	RESPONSE_TYPE : "code",
	SCOPE : "profile",
	STATE : "auth",
	
	AUTH_STATE_LOGIN : 'login',
	AUTH_STATE_COMPLETED : 'completed',
	
	// TODO: Come up with a way to know when to referesh.
	PROPERTIES : [ 'accessToken', 'refreshToken' ],
			
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
	
	remove : function(properties, callback) {

		chrome.storage.sync.remove(properties, function() {
			for (var key in properties) {
				delete Settings.properties[key];
			}
			if (callback){
				callback();
			}
		});

	}

}

var OAuth = {
	formatAuthorizeURL : function() {
		return Settings.BASE_URL + "?client_id=" + Settings.CLIENT_ID + "&response_type=" + Settings.RESPONSE_TYPE + "&scope=" + Settings.SCOPE + "&state=" + Settings.STATE
	}
}

var SettingsPage = {

	init : function() {
		// TODO: Set the status of the button depending on whether we have a valid token.
		$(document).on('click', '#auth_connect', function(e) {
			chrome.runtime.sendMessage('loginButtonPressed');
		});
	}

}