Settings.init(function(properties) {} );

function setLoggedInUI(userID) {
	$('#user_id').html("Logged in with User ID " + userID);
	$('#user_id').show();
	$('#sign_in').hide();
	$('#sign_out').show();
}

function setLoggedOutUI() {
	$('#user_id').hide();
	$('#sign_in').show();
	$('#sign_out').hide();
}

function hideEverything() {
	$('#user_id').hide();
	$('#sign_in').hide();
	$('#sign_out').hide();
}

// TODO: Add all the stuff we need to do here.
$(document).ready(function() {
	$('#sign_in').click(function(e) {
		OAuth.getUserID(function(userID) {
			setLoggedInUI(userID);
		});
	});

	$('#sign_out').click(function(e) {
		Settings.remove(function() {
			setLoggedOutUI();
		});
	});

	chrome.storage.sync.get(Settings.USER_ID_KEY, function(data) {
      if (data.userID) {
      	setLoggedInUI(data.userID);
      } else {
      	setLoggedOutUI()
      }
    });
});