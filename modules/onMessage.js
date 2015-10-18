function onMessage(bot, args){
	
	if(args.t){
		var message = args.t.split(' ');
		if(message[0].charAt(0) == '!')
			switch(message[0]){

				case '!say':
					delete message[0];
					message = message.join(' ').trim();
					if(message.charAt(0) != '/')
						bot.sendMessage(message);
					else
						bot.sendMessage('Nope.');
				break;
			}
	}
};

module.exports = onMessage;