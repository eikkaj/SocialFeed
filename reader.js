var feedItems = [];
var twitterUser = "username";

var feed1 = {
	url:'http://username.tumblr.com/api/read/json?callback=?',
	type: 'tumblr'
};

var feed2 = {
	url: 'https://api.twitter.com/1/statuses/user_timeline/' + twitterUser + '.json?callback=?&count=15&include_rts=1',
	type: 'twitter'
};

var feed3 = {
	url: 'https://graph.facebook.com/237100573399/feed?access_token=###|d_9iQElKDRj6Ty5DtiNjyVqkr5A',
	type: 'facebook'
};
	
//Tumblr
var request1 = $.getJSON(feed1.url,function (data) { 
      $.each(data.posts, function(i,posts){ 
        var url = this.url
        var message = this["regular-body"]; 
        var date = this.date; 
        var from = this.url;  
        
		var item = {
            url: url,
            message: message,
            from: feed1.type,
            date: date
        };
		feedItems.push(item);
      }); 
});

//Twitter
var request2 = $.getJSON(feed2.url, function (data) {
	for(var i = 0; i< data.length; i++){

		//var tweet = data[i].text;
		var dateOf = new Date(data[i].created_at);
		var dateNow = new Date();
		var dateDiff = dateNow - dateOf;
		var hours = Math.round(dateDiff / (1000 * 60 * 60));	
		var item = {
			url: "http://twitter.com/#!/" + twitterUser + '/status/' + data[i].id_str,
			message: data[i].text,
			from: feed2.type,
			date: hours + " hours ago"
		};
		
			if (hours > 24) {
				hours = Math.floor(hours /24);
					var item = {
						url: "http://twitter.com/#!/" + twitterUser + '/status/' + data[i].id_str,
						message: data[i].text,
						from: feed2.type,
						date: hours + " days ago"
					};
				};
				
			if (hours < 1) {
				hours = Math.ceil((hours/24)/60);
					var item = {
						url: "http://twitter.com/#!/" + twitterUser + '/status/' + data[i].id_str,
						message: data[i].text,
						from: feed2.type,
						date: hours +" minutes ago"
					};
				};
			
		feedItems.push(item);
	}
});
	  
//Facebook
var request3 = $.getJSON(feed3.url, function(json) {

	$.each(json.data,function(i, fb) {

		//check if there is a message, otherwise print story??
		if (fb.message !== undefined) {
				var month = fb.created_time.substring(5,7);
				var day = fb.created_time.substring(8,10);
				var year = fb.created_time.substring(0,4);
				var date = month + "-" + day + "-" + year;
			var item = {
				url: fb.link,
				message: fb.message,
				from: feed3.type,
				date: date
			};
		} else {
			return;
		};
		feedItems.push(item);		
	});
});

$.when(request1, request2, request3).then(function () {
	BuildFeedReader();
});



function BuildFeedReader() {
	$.shuffle(feedItems);
		var strBuilder = "";

	$.each(feedItems, function (index, value) {
		strBuilder += '<dd class="feed-' + value.from + '"><a href="' + value.url + '" target="_blank"><div>' + value.date + '</div>' + value.message + '</a></dd>';
	});

		var ticker = $("#ticker");
			ticker.html(strBuilder);

		//animator function
		function animator(currentItem) {

		//work out new anim duration
		var distance = currentItem.height();
			duration = (distance + parseInt(currentItem.css("marginTop"))) / 0.02;
	
		//animate the first child of the ticker
		currentItem.animate({ marginTop: -distance }, duration, "linear", function () {

		//move current item to the bottom
		currentItem.appendTo(currentItem.parent()).css("marginTop", 0);
		
		//recurse
		animator(currentItem.parent().children(":first"));

	});
};

	//start the ticker
	animator(ticker.children(":first"));

	//set mouseenter
	ticker.mouseenter(function () {

		//stop current animation
		ticker.children().stop();

	}).mouseleave(function () {

		//resume animation
		animator(ticker.children(":first"));
	});
}


//Shuffle Array Up
$.fn.shuffle = function () {
	return this.each(function () {
	
		var items = $(this).children();
			
			return (items.length) ? $(this).html($.shuffle(items)) : this;
	});
}

$.shuffle = function (arr) {

	for (
		var j, x, i = arr.length; i;
		j = parseInt(Math.random() * i),
		x = arr[--i], arr[i] = arr[j], arr[j] = x
	);

	return arr;
}