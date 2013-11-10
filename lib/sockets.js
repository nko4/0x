var _ = require('underscore'),
  async = require('async'),
  crypto = require('crypto'),
  engine = require('./engine'),
  //engine = require('./engine-mock'),
  store = require('./store'),
  uuid = require('node-uuid');

var sockets = {
  started: {}
};

sockets.pruneRooms = function() {
  console.log('sockets.pruneRooms');
  var started = _.keys(sockets.started);
  var active = sockets.rooms();
  var diff = _.difference(started, active);
  console.log('sockets.pruneRooms', { started: started, active: active, diff: diff });
  async.each(diff, function(room, cb) {
    engine.stop(room, function(e) {
      delete started[room];
      return cb(e);
    });
  }, function(e) {
    if (e) {
      console.error('sockets.pruneRooms', {
        error: e
      });
    }
    setTimeout(sockets.pruneRooms, 10000);
  });
};

sockets.rooms = function() {
  var keys = _.keys(sockets.io.sockets.manager.rooms);
  keys.shift();
  return _.map(keys, function(key) {
    return key.substring(1);
  });
};

sockets.stepOne = function(room, done) {
  engine.step(room, function(e, data) {
    if (e) {
      return done({
        room: room,
        error: e
      });
    }

    sockets.io.sockets['in'](room).emit('step', data);
    return done();
  });
};

sockets.stepAll = function() {
  async.each(sockets.rooms(), sockets.stepOne, function(e) {
    if (e) {
      console.error(e);
    }
    setTimeout(sockets.stepAll, 40);
  });
};

sockets.subscribe = function(socket, subscription) {
  subscription.conference.id = subscription.conference.slug + ':' + subscription.conference.year;

  console.log('sockets.subscribe', {
    socket: socket.id,
    subscription: subscription
  });

  var details;

  async.waterfall([
    function(cb) {
      return store.getConference(subscription.conference, cb);
    },
    function(d, cb) {
      details = d;
      return engine.start(details, cb);
    },
    function(cb) {
      sockets.started[subscription.conference.id] = true;
      socket.emit('details', details);
      return cb();
    },
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

sockets.add = function(socket, data) {
  var thing = {
    id: socket.id + ':' + uuid.v1(),
    type: data.type
  }
  var id = data.conference.slug + ':' + data.conference.year;
  engine.add(id, thing, function(e) {
    if (e) {
      console.error('sockets.add', {
        id: id,
        thing: thing,
        error: e
      });
    }
  });
};

sockets.move = function(socket, data) {
  console.log('move', data);
  var id = data.conference.slug + ':' + data.conference.year;
  var thing = {
    id: data.id,
    lat: data.lat,
    lng: data.lng
  };

  engine.move(id, thing, function(e) {
    if (e) {
      console.error('sockets.move', {
        id: id,
        thing: thing,
        error: e
      });
    }
  });
};

sockets.connect = function(socket) {
  console.log('sockets.connect', {
    socket: socket.id
  });
  socket.on('subscribe', function(data) {
    sockets.subscribe(socket, data);
  });
  socket.on('add', function(data) {
    sockets.add(socket, data);
  });
  socket.on('move', function(data) {
    sockets.move(socket, data);
  });
};

sockets.init = function(io) {
  console.log('sockets.init');
  sockets.io = io;
  sockets.io.set('log level', 1);
  sockets.io.sockets.on('connection', sockets.connect);
  sockets.stepAll();
  sockets.pruneRooms();
};

module.exports = sockets;
