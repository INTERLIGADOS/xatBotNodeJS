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
	}
};

module.exports = onCommand;