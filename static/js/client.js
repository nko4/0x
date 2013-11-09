var step = function() {
  console.log('step...');
};

var socket = io.connect();
socket.on('connect', function() {
  socket.emit('subscribe', { conference: conference });
  socket.on('step', step);
});

var lat = 51.75202, lng = -1.25773;
var map = L.map('map').setView([lat, lng], 16);

// add an OpenStreetMap tile layer
L.tileLayer('http://b.tile.stamen.com/toner/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
