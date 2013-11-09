var state = {
  map: {},
  details: {},
  markers: {}
};

var getIcon = function(attendee) {
  var ext = attendee.type == "zombie" ? "-z.jpg" : "-n.jpg";
  return L.icon({
    iconUrl: '/heads/' + attendee.id + ext,
    iconSize: [25, 25],
    iconAnchor: [25, 13],
    title: attendee.name
  });
}

var stepOne = function(thing) {
  if (!state.markers[thing.id]) {
    var marker = L.marker([thing.lat, thing.lng], {
      icon: getIcon(thing)
    });
    marker.thing = thing;
    state.markers[thing.id] = marker;
    state.markers[thing.id].addTo(state.map);
  } else if (state.markers[thing.id].thing.type !== thing.type) {
    state.map.removeLayer(state.markers[thing.id]);
    delete state.markers[thing.id];
    return stepOne(thing);
  } else {
    state.markers[thing.id].setLatLng([thing.lat, thing.lng]);
    state.markers[thing.id].update();
  }
};

var step = function(things) {
  for (var i = 0; i < things.length; ++i) {
    stepOne(things[i]);
  };
};

var details = function(details) {
  state.details = details;
  state.map = L.map('map').setView([details.conference.location.lat, details.conference.location.lng], 15, {
    pan: {
      animate: true
    }
  });

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
