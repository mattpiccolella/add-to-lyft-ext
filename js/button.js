// Get domain
var domain = extractDomain(window.location.href).toLowerCase();
console.log(domain);

if(domain.includes("yelp")) {
	$('.mapbox-text ul li').last().after('<li><div class="add-to-lyft"><img src="http://i.imgur.com/uCdcd0a.png"><div class="add-to-lyft-text">Add to Lyft</div></div></li>');
	$('.add-to-lyft').after('<script> \
			clickHandlers(); \
		</script>');
}
else if (window.location.href.includes('google.com/maps/place')) {
	console.log("inserting");
	$('.widget-pane-section-rating').append('<li><div class="add-to-lyft"><img src="http://i.imgur.com/uCdcd0a.png"><div class="add-to-lyft-text">Add to Lyft</div></div></li>');
	$('.add-to-lyft').after('<script> \
			clickHandlers(); \
		</script>');
}
else if (domain.includes("opentable")) {
	$('h6:contains("Limo & Car")').after('<li><div class="add-to-lyft"><img src="http://i.imgur.com/uCdcd0a.png"><div class="add-to-lyft-text">Add to Lyft</div></div></li>');
	$('.add-to-lyft').after('<script> \
			clickHandlers(); \
		</script>');

}
else if(domain.includes("foursquare")) {
	$('.primaryInfo').append('<div class="add-to-lyft"><img src="http://i.imgur.com/uCdcd0a.png"><div class="add-to-lyft-text">Add to Lyft</div></div>');
	$('.add-to-lyft').after('<script> \
			clickHandlers(); \
		</script>');
}
else if(domain.includes("airbnb")) {
	$('a.hide-print[href*="maps"]').before('<div class="add-to-lyft"><img src="http://i.imgur.com/uCdcd0a.png"><div class="add-to-lyft-text">Add to Lyft</div></div>');
	$('.add-to-lyft').after('<script> \
			clickHandlers(); \
		</script>');
}
else if(domain.includes("meetup")) {
	$('.clearfix.figureset-description').last().append('<div class="add-to-lyft"><img src="http://i.imgur.com/uCdcd0a.png"><div class="add-to-lyft-text">Add to Lyft</div></div>');
	$('.add-to-lyft').after('<script> \
			clickHandlers(); \
		</script>');
}
else if(domain.includes("fandango")) {
	$('#theaterAddress').after('<div class="add-to-lyft"><img src="http://i.imgur.com/uCdcd0a.png"><div class="add-to-lyft-text">Add to Lyft</div></div>');
	$('.add-to-lyft').after('<script> \
			clickHandlers(); \
		</script>');
}

// Get Lyft ID into page
var lyftId; 
chrome.storage.sync.get('userID', function(object) {
	lyftId = object.userID;
});

// Helper function
function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

function extractYelpBizUrl(url) {
	var indexOfBiz = url.indexOf('biz');

	return url.substring(indexOfBiz + 4, url.length);
}

function extractAirbnbListingId(url) {
	var documentHtml = document.documentElement.innerHTML;
	var indexOfHostingId = documentHtml.indexOf('hosting_id');
	var quote = '&quot;';
	var documentUpToHosting = documentHtml.substring(indexOfHostingId + 10 + quote.length+1,documentHtml.length);
	var data = documentHtml.substring(indexOfHostingId+10+quote.length+1, indexOfHostingId+10+quote.length+1 + documentUpToHosting.indexOf(quote)-1)
	return data;
}

function clickHandlers() {

	$(".add-to-lyft").click(function() { 

		// Check that it already hasn't been added
		if($('.add-to-lyft').hasClass('added')) {
			return;
		}

		var domain = extractDomain(window.location.href).toLowerCase();

		var label;
		var addressString;
		var deeplinkURL;
		var shortcutType;
		var date;
		var time;

		if(domain.includes("yelp")) {
		    label = $.trim($('.biz-page-title').text());

			var streetAddress = $('span[itemprop=streetAddress').text();
			var locality = $('span[itemprop=addressLocality').text();
			var region = $('span[itemprop=addressRegion').text();
			var postalCode = $('span[itemprop=postalCode').text();

			addressString = streetAddress + " " + locality + " " + region + " " + postalCode;

			var baseDeeplinkURL = "yelp:///biz/";
			var bizUrl = extractYelpBizUrl(window.location.href);
			deeplinkURL = baseDeeplinkURL + bizUrl;

			shortcutType = "yelp";
		}
		else if(domain.includes("opentable")) {
			label = $('.restaurant-name > h4 > a').html() + " Reservation";

			addressString = $('.content-block-map-info > p').html().replace("<br>", " ");

			deeplinkURL = "yelp:///search?terms="+label.replace(/ /g, '+');

			shortcutType = "opentable";

			date = $('.reservation-date .show-for-desktop-only').html();
			time = $('#reso-time').html();
		}
		else if(domain.includes("airbnb")) {
			label = $.trim($('.itinerary-header .text-center-on-sm span').first().text()).replace("You’re going to ",'').replace('!','') + " Airbnb";

			addressString = $('div[data-reactid=".5.4.0.0.1.3.0.1.0"]').html().replace(/<br>/g, " ");

			var baseDeeplinkURL = "airbnb://rooms/";
			var roomId = extractAirbnbListingId(window.location.href)
			console.log(roomId);
			deeplinkURL = baseDeeplinkURL + roomId;

			shortcutType = "airbnb";

			date = $('span[data-reactid=".5.4.0.0.1.2.0.1.1.0"]').text();
			time = $('span[data-reactid=".5.4.0.0.1.2.0.1.1.2"]').text().replace("Anytime after ", "");
		}
		else if(domain.includes("fandango")) {
			label = $('#movieTitle').html() + " at " + $('#theaterName').html();

			addressString = $('#theaterAddress > a').html().replace("<br>", " ");

			deeplinkURL = "";

			shortcutType = "fandango";

			date = $('#movieDate').html();

			time = $('#movieTime').html();

		}
		else {
			return;
		}

		// Perform Ajax call to add to lyft
		var postParams = {
			label: label,
			address: addressString, 
			lyft_id: lyftId,
			deeplinkUrl: deeplinkURL,
			shortcutType: shortcutType
		};

		if(date != null) {
			postParams['date'] = date;
		}

		if(time != null) {
			postParams['time'] = time;
		}

		console.log(postParams);

		$.ajax({
			url: 'https://intense-ravine-96517.herokuapp.com/add_shortcut/',
			data: postParams,
			method: 'POST',
			success: function(response) {
				$('.add-to-lyft-text').text("");
				$('.add-to-lyft-text').text("Added!").fadeIn(500);
				$('.add-to-lyft').addClass('added')

			}
		});

	}); 
}