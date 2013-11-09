var sockets = {}

sockets.io = null;

// simple timeout based stepper for now...
function step() {
  console.log('sockets: step');
  sockets.io.sockets
    .in('nodeconfeu:2013')
    .emit('step', 'DATA');
  
  setTimeout(step, 2000);
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
