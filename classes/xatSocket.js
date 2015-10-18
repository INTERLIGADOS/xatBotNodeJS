function Socket(net, xml){
	this.socket = new net.Socket();
	this.xml    = xml;
}

Socket.prototype.connect = function(ip, port, callback){
	this.socket.connect(ip, port, callback);
};

Socket.prototype.write = function(message){
	console.log('--> ' + message);
	this.socket.write(message + '\0');
};

Socket.prototype.read = function(callback){

	var self = this;

	this.socket.on('data', function(data){

		data = data.toString();
		console.log('<-- ' + data);
		self.parsePacket(data, callback);

	});
};

Socket.prototype.disconnect = function(){
	this.socket.destroy();
};

Socket.prototype.parsePacket = function(data, callback){

	var self = this;
	var packet = {
		node: '',
		elements: {}
	};

	temp = self.xml.xml2obj(data);
	delete temp[Object.keys(temp)[0]]['@'];
	packet.node = Object.keys(temp)[0];
	packet.elements = temp[Object.keys(temp)[0]];

	callback(packet);
};

module.exports = Socket;