var sockets = {}

sockets.init = function(io) {
  io.sockets.on('connection', function(socket) {
    socket.on('subscribe', function(data) {
      console.log('subscribing to' + data.conference);
      socket.join(data.conference);
    });
  });
}

module.exports = sockets;
