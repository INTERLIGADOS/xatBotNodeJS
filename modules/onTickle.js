function onTickle(bot, args){
	
	if(args.t == '/l')
		bot.answerTickle(this.parseU(args.u));
};

onTickle.prototype.parseU = function(uid){
	return uid.split('_')[0];
}

module.exports = onTickle;