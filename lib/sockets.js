var _ = require('underscore'),
  async = require('async'),
  engine = require('./engine-mock');

var sockets = {}

sockets.stepInterval = 2000;

sockets.rooms = function() {
  var keys = _.keys(sockets.io.sockets.manager.rooms);
  keys.shift();
  return _.map(keys, function(key) {
    return key.substring(1);
  });
};

sockets.emitToRoom = function(room, name, data) {
  sockets.io.sockets['in'](room).emit(name, data);
};

sockets.step = function(room, done) {
  console.log('sockets.step', room);
  sockets.emitToRoom(room, 'step', 'DATA');
  return done();
};

// simple timeout based stepper for now...
sockets.stepAll = function() {
  console.log('sockets.stepAll');
  async.each(sockets.rooms(), sockets.step, function(e) {
    if (e) {
      console.error(e);
    }
    setTimeout(sockets.stepAll, sockets.stepInterval);
  });
}

sockets.connection = function(socket) {
  socket.on('subscribe', function(data) {
    console.log('sockets: subscribing to: ' + data.conference.id);    
    socket.join(data.conference.id);

  });
}

sockets.init = function(io) {
  sockets.io = io;
  sockets.io.sockets.on('connection', sockets.connection);
  sockets.stepAll();
}

module.exports = sockets;
