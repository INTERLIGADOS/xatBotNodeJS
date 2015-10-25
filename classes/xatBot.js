var xatNetwork = require('./xatNetwork');

function Bot() {
	this.network = new xatNetwork();
	this.users   = {};
}

Bot.prototype.onData = function(callback) {

	var self = this;
	self.network.login(function(){
		self.network.connectToChat(function(packet){
			callback(packet);
		});
	});
};

module.exports = Bot;