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
  async.each(sockets.rooms(), sockets.step, function(e) {
    if (e) {
      console.error(e);
    }
    setTimeout(sockets.stepAll, sockets.stepInterval);
  });
};

sockets.getConferenceDetails = function(id, done) {
  var details = {
    conference: {
      id: id,
      lat: 51.75202,
      lng: -1.25773
    },
    attendees: [{
        id: 'aadjffhffdkdss'
      }, {
        id: 'sahfjfdjhfg'
      }
    ]
  }
  return done(null, details);
};

sockets.subscribe = function(socket, subscription) {
  console.log('sockets.subscribe', {
    subscription: subscription
  });

  sockets.getConferenceDetails

  async.waterfall([
    function(cb) {
      return sockets.getConferenceDetails(subscription.conference.id, cb);
    },
    engine.start,
    function(data, cb) {
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

sockets.connection = function(socket) {
  socket.on('subscribe', function(data) {
    sockets.subscribe(socket, data);
  });
};

sockets.init = function(io) {
  sockets.io = io;
  sockets.io.sockets.on('connection', sockets.connection);
  sockets.stepAll();
};

module.exports = sockets;
