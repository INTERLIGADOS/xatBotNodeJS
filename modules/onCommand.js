function onCommand(bot, args){
	console.log(args);
	args.t = args.t.substring(1);
	console.log(args);

	var message = args.t.split(' ');
	console.log(message);
	switch(message[0]){

		case 'say':
			delete message[0];
			message = message.join(' ').trim();
			if(message.charAt(0) != '/')
				bot.sendMessageAutoDetection(args.u, message, args.type);
			else
				bot.sendMessageAutoDetection(args.u, 'Nope.', args.type);
		break;
	}
};

module.exports = onCommand;