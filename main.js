var xatNetwork = require('./classes/xatNetwork');
var config     = require('./config');

var bot = new xatNetwork(config);

bot.login(function(){

	bot.connectToChat(function(packet){

		var hook = '';
		var args = packet.elements;;
		switch(packet.node){

			case 'm':
				hook = 'onMessage';
			break;

			case 'z':
				hook = 'onTickle';
			break;

			default:
				console.log('Undefined packet "' + packet.node + '"');
			break;

		}

		if(hook){

			var module = require('./modules/' + hook);
			var obj    = new module(bot, args);

		}
	});

});