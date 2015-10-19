var xatNetwork = require('./classes/xatNetwork');
var config     = require('./config');

var bot = new xatNetwork(config);

bot.login(function(){

	bot.connectToChat(function(packet){

		var hook = '';
		var args = packet.elements;;
		switch(packet.node){

			case 'm':
				if(args.u && !args.s && !args.p && args.i)
					hook = 'onMessage';
			break;

			case 'p':
				if(args.d)
					hook = 'onPC';
				else
					hook = 'onPM';
			break;

			case 'z':
				hook = 'onTickle';
			break;

			case 'l':
				hook = 'onUserLeft';
			break;

			case 'u':
				hook = 'onUserJoined'
			break;

			case 'idle':
				hook = 'onIdle';
			break;

			default:
				console.log('Undefined packet "' + packet.node + '"');
			break;

		}

		if(hook){

			if((hook == 'onMessage' || hook == 'onPC' || hook == 'onPM') && args.t.charAt(0) == config.cmdcode){
				
				if(hook == 'onMessage')
					args.type = 1;
				else if(hook == 'onPM')
					args.type = 2;
				else if(hook == 'onPC')
					args.type = 3;

				hook = 'onCommand';
			}
			var module = require('./modules/' + hook);
			var obj    = new module(bot, args);

		}
	});

});