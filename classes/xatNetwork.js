var net       = require('net');
var xmlobj    = require('nodexml');
var xatSocket = require('./xatSocket');

var loginpacket = null;

function Network(config){
	this.config = config;
	this.socket = null;
}

Network.prototype.login = function(callback){

	var self = this;
	self.socket = new xatSocket(net, xmlobj);
	self.socket.connect(10000, '199.195.198.168', function(){

		self.socket.write('<y r="8" v="0" u="' + self.config.xatid + '" />');
		self.socket.read(function(packet){

			if(packet.node == 'y')
				self.socket.write('<v n="' + self.config.regname + '" p="$-' + self.config.password + '" />');

			if(packet.node == 'v')
			{
				loginpacket = packet.elements;
				self.socket.disconnect();
				callback();
			}

		});

	});

};

Network.prototype.connectToChat = function(callback){

	var self = this;
	self.socket = new xatSocket(net, xmlobj);
	self.socket.connect(10021, '50.115.127.232', function(){

		self.socket.write('<y r="' + self.config.chat + '" m="1" v="0" u="' + loginpacket.i + '"' + self.config.foobar + ' />');
		self.socket.read(function(packet){

			if(packet.node == 'y')
			{
				var data = {};

				data.node     = 'j2';
				data.elements = {};
				
				data.elements['cb'] = new Date().getTime();
				data.elements['l5'] = '65535';
				data.elements['l4'] = '500';
				data.elements['l3'] = '500';
				data.elements['l2'] = '0';
				data.elements['q']  = '1';
				data.elements['y']  = packet.elements.i;
				data.elements['k']  = loginpacket.k1;
				data.elements['k3'] = loginpacket.k3;
				data.elements['p']  = '0';
				data.elements['c']  = self.config.chat;
				data.elements['r']  = '';
				data.elements['f']  = '0';
				data.elements['e']  = '';
				data.elements['d0'] = loginpacket.d0;
				data.elements['d2'] = loginpacket.d2;
				data.elements['d3'] = loginpacket.d3;
				data.elements['dx'] = loginpacket.dx;
				data.elements['dt'] = loginpacket.dt;
				data.elements['N']  = self.config.regname;
				data.elements['n']  = self.config.botname;
				data.elements['a']  = self.config.avatar;
				data.elements['h']  = self.config.homepage;
				data.elements['v']  = '</> with <3 by Jedi';

				self.socket.buildPacket(data);
			}
			else
				callback(packet);

		});
	});
};

Network.prototype.sendMessage = function(message){
	var self = this;
	var data = {};

	data.node     = 'm';
	data.elements = {};

	data.elements['t'] = message;
	data.elements['u'] = self.config.xatid;

	self.socket.buildPacket(data);
};

Network.prototype.sendPrivateMessage = function(uid, message){
	var self = this;
	var data = {};

	data.node     = 'p';
	data.elements = {};

	data.elements['u'] = uid;
	data.elements['t'] = message;

	self.socket.buildPacket(data);
}

Network.prototype.sendPrivateConversation = function(uid, message){
	var self = this;
	var data = {};

	data.node     = 'p';
	data.elements = {};

	data.elements['u'] = uid;
	data.elements['t'] = message;
	data.elements['s'] = '2';
	data.elements['d'] = self.config.xatid;

	self.socket.buildPacket(data);
}

Network.prototype.sendMessageAutoDetection = function(uid, message, type){
	var self = this;
	if(type == 1)
		self.sendMessage(message);
	else if(type == 2)
		self.sendPrivateMessage(uid, message);
	else if(type == 3)
		self.sendPrivateConversation(uid, message);
}

Network.prototype.answerTickle = function(uid){
	var self = this;
	var data = {};

	data.node     = 'z';
	data.elements = {};

	data.elements['d'] = uid;
	data.elements['u'] = self.config.xatid + '_0';
	data.elements['t'] = '/a_NF';

	self.socket.buildPacket(data);
}

Network.prototype.guest = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {};

	data.elements['u'] = uid;
	data.elements['u'] = '/r';

	self.socket.buildPacket(data);
}

Network.prototype.member = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {};

	data.elements['u'] = uid;
	data.elements['u'] = '/e';

	self.socket.buildPacket(data);
}

Network.prototype.moderator = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {};

	data.elements['u'] = uid;
	data.elements['u'] = '/m';

	self.socket.buildPacket(data);
}

Network.prototype.owner = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {};

	data.elements['u'] = uid;
	data.elements['u'] = '/M';

	self.socket.buildPacket(data);
}

Network.prototype.kick = function(uid, reason){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {};

	data.elements['p'] = reason;
	data.elements['u'] = uid;
	data.elements['t'] = '/k';

	self.socket.buildPacket(data);
}

Network.prototype.ban = function(uid, time, reason){
	var self = this;
	var data = {};

	if(!time || time < 0)
		time = 3600;
	else
		time *= 3600;

	data.node     = 'c';
	data.elements = {};

	data.elements['p'] = reason;
	data.elements['u'] = uid;
	data.elements['t'] = '/g' + time;

	self.socket.buildPacket(data);
}

Network.prototype.unban = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {};

	data.elements['u'] = uid;
	data.elements['t'] = '/u';

	self.socket.buildPacket(data);
}

module.exports = Network;