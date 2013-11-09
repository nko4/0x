var state = {
  map: {},
  details: {},
  markers: {}
};

var getImgSrc = function(thing) {
  var ext = thing.type == "zombie" ? "-z.jpg" : "-n.jpg";
  return '/heads/' + thing.id + ext;
}

var getIcon = function(thing) {
  return L.icon({
    iconUrl: getImgSrc(thing),
    iconSize: [25, 25],
    iconAnchor: [25, 13],
    title: thing.name
  });
}

var addToList = function(thing) {
  thing.type = thing.type || 'human';
  $('#list').append('<li class="' + thing.type + '" id="l' + thing.id + '"><img id="i'+ thing.id + '" src="' + getImgSrc(thing) + '"></img>' + thing.name + '</li>');
};

var stepOne = function(thing) {
  if (!state.markers[thing.id]) {
    var marker = L.marker([thing.lat, thing.lng], {
      icon: getIcon(thing)
    });
    marker.thing = thing;
    state.markers[thing.id] = marker;
    state.markers[thing.id].addTo(state.map);
    $('#l' + thing.id).attr('class', thing.type);
    $('#i' + thing.id).attr('src', getImgSrc(thing));
  } else if (state.markers[thing.id].thing.type !== thing.type) {
    console.log(thing.id + ' has become a zombie');
    $('#l' + thing.id).attr('class', thing.type);
    $('#i' + thing.id).attr('src', getImgSrc(thing));
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

  for (var i = 0; i < state.details.attendees.length; ++i) {
    addToList(state.details.attendees[i]);
  }
  $('#conference-name').text('Zombies at ' + details.conference.title + '!!');
};

$(function() {
  var socket = io.connect();
  socket.on('connect', function() {
    socket.on('details', details);
    socket.on('step', step);
    socket.emit('subscribe', {
      conference: conference
    });
  });
});
