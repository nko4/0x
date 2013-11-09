var _ = require('underscore'),
  async = require('async'),
  //  engine = require('./engine'), 
  engine = require('./engine-mock'),
  store = require('./store');

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
  console.log('sockets.emitToRoom', { room: room, name: name });
  sockets.io.sockets['in'](room).emit(name, data);
};

sockets.stepOne = function(room, done) {
  console.log('sockets.step', room);
  engine.step(room, function(e, data) {
    if (e) {
      return done({
        room: room,
        error: e
      });
    }

    sockets.emitToRoom(room, 'step', data);
    return done();
  });
};

sockets.stepAll = function() {
  console.log('sockets.stepAll');
  async.each(sockets.rooms(), sockets.stepOne, function(e) {
    if (e) {
      console.error(e);
    }
    setTimeout(sockets.stepAll, sockets.stepInterval);
  });
};

sockets.subscribe = function(socket, subscription) {
  console.log('sockets.subscribe', {
    socket: socket.id,
    subscription: subscription
  });

  sockets.getConferenceDetails

  async.waterfall([
    function(cb) {
      return store.getConference(subscription.conference.id, cb);
    },
    engine.start,
    function(cb) {
      socket.join(subscription.conference.id);
      return cb();
    }
  ], function(e) {
    if (e) {
      console.error('sockets.subscribe', {
        subscription: subscription,
        error: e
      });
    }
  });
};

sockets.connect = function(socket) {
  console.log('sockets.connect', { socket: socket.id });
  socket.on('subscribe', function(data) {
    sockets.subscribe(socket, data);
  });
};

sockets.init = function(io) {
  console.log('sockets.init');
  sockets.io = io;
  sockets.io.sockets.on('connection', sockets.connect);
  sockets.stepAll();
};

module.exports = sockets;
