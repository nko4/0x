var state = {
  map: {},
  details: {},
  markers: {}
};

var stepOne = function(thing) {
  if(thing.type != "person") {
    return;
  };

  var attendee = thing;
  if(!state.markers[attendee.id]) {
    state.markers[attendee.id] = L.marker([attendee.lat, attendee.lng]);
    state.markers[attendee.id].addTo(state.map);
  } else {
    state.markers[attendee.id].setLatLng([attendee.lat, attendee.lng]);
    state.markers[attendee.id].update();
  }
};

var step = function(things) {
  for(var i=0; i<things.length; ++i) {
    stepOne(things[i]);
  };
};

var details = function(details) {
  state.details = details;
  
  state.map = L.map('map').setView([details.conference.location.lat, details.conference.location.lng], 16);

  // add an OpenStreetMap tile layer
  L.tileLayer('http://b.tile.stamen.com/toner/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(state.map);
};

var socket = io.connect();
socket.on('connect', function() {
  socket.on('details', details);
  socket.on('step', step);
  socket.emit('subscribe', {
    conference: conference
  });
});
