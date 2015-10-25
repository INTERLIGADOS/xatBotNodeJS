var _       = require('underscore');
var request = require('request');

function onCommand(bot, args){
	args.t = args.t.substring(1);

	var message = args.t.split(' ');
	switch(message[0]){

		case 'say':
			delete message[0];
			message = message.join(' ').trim();
			if(message.charAt(0) != '/')
				bot.sendMessageAutoDetection(args.u, message, args.type);
			else
				bot.sendMessageAutoDetection(args.u, 'Nope.', args.type);
		break;

		case 'memory':
			var util = require('util');
			console.log(util.inspect(process.memoryUsage()));
		break;

		case 'misc':
			switch(message[1]){
				case 'chatid':
					if(message[2]){
						request('http://xat.com/web_gear/chat/roomid.php?d=' + message[2], function(error, response, body){
							if(!error && response.statusCode == 200){
								if(body != '-10-110')
									bot.sendMessageAutoDetection(args.u, 'The chatid is: ' + body, args.type);
								else
									bot.sendMessageAutoDetection(args.u, 'The chat does not exist.', args.type);
							}
						});
					}else{
						bot.sendMessageAutoDetection(args.u, 'Usage: !misc chatid [chatname]', args.type);
					}
				break;

				case 'regname':
				case 'reg':
					if(message[2]){
						if(!isNaN(message[2])){
							request('http://xat.me/Jedi?id=' + message[2], function(error, response, body){
								if(!error && response.statusCode == 200){
									if(body)
										bot.sendMessageAutoDetection(args.u, 'The regname is: ' + body, args.type);
									else
										bot.sendMessageAutoDetection(args.u, 'This xatid does not exist.', args.type);
								}
							});
						}else{
							bot.sendMessageAutoDetection(args.u, 'The xatid cannot be not numeric.', args.type);
						}
					}else{
						bot.sendMessageAutoDetection(args.u, 'Usage: !misc regname [xatid]', args.type);
					}
				break;

				case 'id':
					if(message[2]){
						if(isNaN(message[2])){
							request('http://xat.me/Jedi?name=' + message[2], function(error, response, body){
								if(!error && response.statusCode == 200){
									if(body)
										bot.sendMessageAutoDetection(args.u, 'The xatid is: ' + body, args.type);
									else
										bot.sendMessageAutoDetection(args.u, 'This regname does not exist.', args.type);
								}
							});
						}else{
							bot.sendMessageAutoDetection(args.u, 'The regname cannot be a numeric value.', args.type);
						}
					}else{
						bot.sendMessageAutoDetection(args.u, 'Usage: !misc id [regname]', args.type);
					}
				break;

				default:
					bot.sendMessageAutoDetection(args.u, 'Usage: !misc [chatid/regname/id]', args.type);
			}
		break;

		case 'xavi':
			// Edit xavi
			request('http://xat.com/json/xavi/get.php?u=' + bot.config.xatid, function(error, response, body){
				if(error)
					return console.log(error);

				if(response.statusCode !== 200)
					return console.log(response.statusCode);

				var xavi = JSON.parse(body);

				console.log(xavi);
				console.log(xavi.xeyel);
				console.log(xavi.hair);
				console.log(xavi.browsl);
				console.log(xavi.head);
				console.log(xavi.acc);

				xavi.hair.c = '34816'; // green
				xavi.hair.l = 'hair12'; // new hair
				xavi.head.c = '34816'; // green

				var params  = {};
				params.k    = bot.config.y.k;
				params.xavi = JSON.stringify(xavi);
				params.u    = bot.config.xatid;
				params.au   = bot.config.y.au;
				params.i    = bot.config.y.i;
				params.v    = bot.config.y.v;
				params.s    = bot.config.y.s;
				params.j    = bot.config.y.j;
				params.t    = bot.config.y.t;

				console.log(params);

				request.post({url:'http://xat.com/json/xavi/put.php', form:params}, function(err, httpResponse, body){
					console.log(body);
				});
			});
		break;

	}
};

module.exports = onCommand;