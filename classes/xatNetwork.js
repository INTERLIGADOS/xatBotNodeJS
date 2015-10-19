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
				var j2   = {};
				j2['cb'] = new Date().getTime();
				j2['l5'] = '65535';
				j2['l4'] = '500';
				j2['l3'] = '500';
				j2['l2'] = '0';
				j2['q']  = '1';
				j2['y']  = packet.elements.i;
				j2['k']  = loginpacket.k1;
				j2['k3'] = loginpacket.k3;
				j2['p']  = '0';
				j2['c']  = self.config.chat;
				j2['r']  = '';
				j2['f']  = '0';
				j2['e']  = '';
				j2['d0'] = loginpacket.d0;
				j2['d2'] = loginpacket.d2;
				j2['d3'] = loginpacket.d3;
				j2['dx'] = loginpacket.dx;
				j2['dt'] = loginpacket.dt;
				j2['N']  = self.config.regname;
				j2['n']  = self.config.botname;
				j2['a']  = self.config.avatar;
				j2['h']  = self.config.homepage;
				j2['v']  = '</> with <3 by Jedi';

				var string = '';
				for(var key in j2)
					if(j2.hasOwnProperty(key))
						string += key + '="' + j2[key] + '" ';

				self.socket.write('<j2 ' + string + '/>');
			}
			else
				callback(packet);

		});
	});
};

Network.prototype.sendMessage = function(message){
	var self = this;
	self.socket.write('<m t="' + message + '" u="' + self.config.xatid + '" />');
};

Network.prototype.sendPrivateMessage = function(uid, message){
	var self = this;
	self.socket.write('<p u="' + uid + '" t="' + message + '" />');
}

Network.prototype.sendPrivateConversation = function(uid, message){
	var self = this;
	self.socket.write('<p u="' + uid + '" t="' + message + '" s="2" d="' + self.config.xatid + '" />');
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
	self.socket.write('<z d="' + uid + '" u="' + self.config.xatid + '_0" t="/a_NF" />');
}

Network.prototype.guest = function(uid){
	var self = this;
	self.socket.write('<c u="' + uid + '" t="/r" />');
}

Network.prototype.member = function(uid){
	var self = this;
	self.socket.write('<c u="' + uid + '" t="/e" />');
}

Network.prototype.moderator = function(uid){
	var self = this;
	self.socket.write('<c u="' + uid + '" t="/m" />');
}

Network.prototype.owner = function(uid){
	var self = this;
	self.socket.write('<c u="' + uid + '" t="/M" />');
}

Network.prototype.kick = function(uid, reason){
	var self = this;
	self.socket.write('<c p="' + reason + '" u="' + uid + '" t="/k" />');
}

Network.prototype.ban = function(uid, time, reason){
	var self = this;

	if(!time || time < 0)
		time = 3600;
	else
		time *= 3600;

	self.socket.write('<c p="' + reason + '" u="' + uid + '" t="/g' + time + '" />');
}

Network.prototype.unban = function(uid){
	var self = this;
	self.socket.write('<c u="' + uid + '" t="/u" />');
}

module.exports = Network;