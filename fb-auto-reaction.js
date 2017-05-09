var page = require('webpage').create();
var server = require('webserver').create();
var system = require('system');
var args = system.args;

function reaction(url) {
	busy = true;
	console.log(url);
	page.open(url, function(status) {
		page.evaluate(function() {
			var ev = document.createEvent('MouseEvent');
			ev.initMouseEvent(
					'mouseover',
					true /* bubble */, true /* cancelable */,
					window, null,
					0, 0, 0, 0, /* coordinates */
					false, false, false, false, /* modifier keys */
					0 /*left*/, null
			);
			if ( document.getElementsByClassName('UFILikeLink').length ) {
				document.getElementsByClassName('UFILikeLink')[0].dispatchEvent(ev);

				var reactInterval = setInterval(function () {
					if ( document.getElementsByClassName('_iuw').length ) {
						var rand_int = Math.floor(Math.random() * 3);
						document.getElementsByClassName('_iuw')[rand_int].click();
						console.log("reaction "+rand_int);
					} else {
						console.log('React button not found');
						clearTimeout(reactInterval);
					}
				}, 1000);
			} else 
				console.log('Like button not found');
		});
	});
}

if ( args.length<2 ) {
	console.log("Not enough args");
	phantom.exit();
} else {
	page.open("http://www.facebook.com/login.php", function(status) {
		if (status === "success") {
			page.onConsoleMessage = function(msg, lineNum, sourceId) {
				console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
			};
			page.evaluate(function(args) {
				console.log('login as '+args[1]);
				document.getElementById("email").value = args[1];
				document.getElementById("pass").value = args[2];
				document.getElementById("loginbutton").click();
				// page is redirecting.
				console.log("logged in");
			}, args);

			setInterval(function() {
				reaction(args[3]);
			}, 5000);
		}
	});
}
