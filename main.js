var xatNetwork = require('./classes/xatNetwork');
var config     = require('./config');

var foo = new xatNetwork(config);

foo.login(function(){

	foo.connectToChat(function(packet){
		console.log(packet);
	});

});