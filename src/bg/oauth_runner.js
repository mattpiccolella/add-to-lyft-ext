var oauth = ChromeExOAuth.initBackgroundPage({
  	'request_url': 'https://api.lyft.com/oauth/authorize',
  	'authorize_url': 'https://api.lyft.com/oauth/token',
  	'access_url': 'https://api.lyft.com/oauth/token',
  	'consumer_key': 'VaorzjmoQAtG',
  	'consumer_secret': 'X4t1164l_Pjywzi84OaEeJapFuAJ0gkt',
  	'scope': 'profile'
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message === 'loginButtonPressed') {
		oauth.authorize(function() {
			console.log('woohoo!');
		})        
    }
});