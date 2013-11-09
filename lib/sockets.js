var _ = require('underscore'), 
  engine = require('./engine-mock');

var sockets = {}

sockets.rooms = function() {
  var keys = _.keys(sockets.io.sockets.manager.rooms);
  keys.shift();
  return _.map(keys, function(key) {
    return key.substring(1);
  });
};

// simple timeout based stepper for now...
function step() {
  console.log(rooms);
  setTimeout(step, 2000);


    /*  console.log('sockets: step');
  sockets.io.sockets
    .in('nodeconfeu:2013')
    .emit('step', 'DATA');
  
  */
}

function connection(socket) {
  socket.on('subscribe', function(data) {
    console.log('sockets: subscribing to: ' + data.conference.id);
    socket.join(data.conference.id);
  });
}

sockets.init = function(io) {
  sockets.io = io;
  sockets.io.sockets.on('connection', connection);
  step();
}

module.exports = sockets;
