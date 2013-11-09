var step = function() {
  console.log('step...');
};

var socket = io.connect();
socket.on('connect', function() {
  socket.emit('subscribe', { conference: conference });
  socket.on('step', step);
});
