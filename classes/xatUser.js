function User(packet) {

	this.id      = packet.u  ? packet.u  : 0;
	this.regname = packet.N  ? packet.N  : null;

	this.nick    = packet.n  ? packet.n  : null;
	this.avatar  = packet.a  ? packet.a  : null;
	this.home    = packet.h  ? packet.h  : null;
	this.bride   = packet.d2 ? packet.d2 : 0;
	this.app     = packet.x  ? packet.x  : 0;
	this.gameban = packet.w  ? packet.w  : 0;

	this.flag0   = packet.f  ? packet.f  : 0;
	this.aflags  = packet.d0 ? packet.d0 : 0;
	this.qflags  = packet.q  ? packet.q  : 0;

	this.login   = packet.cb ? packet.cb : 0;
	this.rev     = packet.v  ? packet.v  : 0;
}

User.prototype.getRank = function(){

	var self = this;
	return (self.flag0 & 7);

};

User.prototype.isMarried = function(){

	var self = this;
	return (self.bride != 0);
};

User.prototype.isMain = function(){

	var self = this;
	return (self.getRank() == 1);

};

User.prototype.isOwner = function(){

	var self = this;
	return (self.getRank() == 4);

};

User.prototype.isModerator = function(){

	var self = this;
	return (self.getRank() == 2);

};

User.prototype.isMember = function(){

	var self = this;
	return (self.getRank() == 3);

};

User.prototype.isGuest = function(){

	var self = this;
	return (self.getRank() == 0);

};

User.prototype.isBanned = function(){

	var self = this;
	return ((self.flag0 & 1 << 4) != 0);

};

module.exports = User;