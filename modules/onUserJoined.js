var xatUser = require('./../classes/xatUser');

function onUserJoined(bot, args){
	if(args.u > 1900000000)
		return;

	bot.users[args.u] = new xatUser(args);
};

module.exports = onUserJoined;