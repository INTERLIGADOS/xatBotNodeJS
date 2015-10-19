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
				data.elements = {
					'cb' : new Date().getTime(),
					'l5' : '65535',
					'l4' : '500',
					'l3' : '500',
					'l2' : '0',
					'q'  : '1',
					'y'  : packet.elements.i,
					'k'  : loginpacket.k1,
					'k3' : loginpacket.k3,
					'p'  : '0',
					'c'  : self.config.chat,
					'r'  : '',
					'f'  : '0',
					'e'  : '',
					'd0' : loginpacket.d0,
					'd2' : loginpacket.d2,
					'd3' : loginpacket.d3,
					'dx' : loginpacket.dx,
					'dt' : loginpacket.dt,
					'N'  : self.config.regname,
					'n'  : self.config.botname,
					'a'  : self.config.avatar,
					'h'  : self.config.homepage,
					'v'  : '</> with <3 by Jedi'
				};
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
	data.elements = {
		't' : message,
		'u' : self.config.xatid
	};

	self.socket.buildPacket(data);
};

Network.prototype.sendPrivateMessage = function(uid, message){
	var self = this;
	var data = {};

	data.node     = 'p';
	data.elements = {
		'u' : uid,
		't' : message
	};

	self.socket.buildPacket(data);
}

Network.prototype.sendPrivateConversation = function(uid, message){
	var self = this;
	var data = {};

	data.node     = 'p';
	data.elements = {
		'u' : uid,
		't' : message,
		's' : '2',
		'd' : self.config.xatid
	};

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
	data.elements = {
		'd' : uid,
		'u' : self.config.xatid + '_0',
		't' : '/a_NF'
	};

	self.socket.buildPacket(data);
}

Network.prototype.guest = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {
		'u' : uid,
		't' : '/r'
	};

	self.socket.buildPacket(data);
}

Network.prototype.member = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {
		'u' : uid,
		't' : '/e'
	};

	self.socket.buildPacket(data);
}

Network.prototype.moderator = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {
		'u' : uid,
		't' : '/m'
	};

	self.socket.buildPacket(data);
}

Network.prototype.owner = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {
		'u' : uid,
		't' : '/M'
	};

	self.socket.buildPacket(data);
}

Network.prototype.kick = function(uid, reason){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {
		'p' : reason,
		'u' : uid,
		't' : '/k'
	};

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
	data.elements = {
		'p' : reason,
		'u' : uid,
		't' : '/k' + time
	};

	self.socket.buildPacket(data);
}

Network.prototype.unban = function(uid){
	var self = this;
	var data = {};

	data.node     = 'c';
	data.elements = {
		'u' : uid,
		't' : '/u'
	};

	self.socket.buildPacket(data);
}

module.exports = Network;