var state = {
  map: {},
  details: {},
  things: {},
  markers: {},
  socket: {}
};

var getImgSrc = function(thing) {
  var ext = thing.type == "zombie" ? "-z.jpg" : "-n.jpg";
  return '/heads/' + thing.id + ext;
}

var getIcon = function(thing) {
  var icon;
  if (thing.type == 'beer') {
    icon = L.AwesomeMarkers.icon({
      icon: 'beer',
      prefix: 'fa',
      markerColor: 'green'
    });
  } else if (thing.type == 'dubstep') {
    icon = L.AwesomeMarkers.icon({
      icon: 'music',
      prefix: 'fa',
      markerColor: '#8A0707'
    });
  } else {
    icon = L.icon({
      iconUrl: getImgSrc(thing),
      iconSize: [25, 25],
      iconAnchor: [25, 13],
      title: thing.name
    });
  }

  return icon;;
}

var addToList = function(thing) {
  thing.type = thing.type || 'human';
  state.things[thing.id] = thing;
  $('#list').append('<li class="' + thing.type + '" id="l' + thing.id + '"><img id="i' + thing.id + '" src="' + getImgSrc(thing) + '"></img>' + thing.name + '</li>');
};

var firstTime = function(thing) {
  //console.log('firsttime: ' + thing.id);
  var marker;

  if (thing.type == 'zombie' || thing.type == 'human') {
    thing.name = state.things[thing.id].name;
    marker = L.marker([thing.lat, thing.lng], {
      icon: getIcon(thing),
      title: thing.name
    });
  } else {
    marker = L.marker([thing.lat, thing.lng], {
      icon: getIcon(thing),
      draggable: true,
      title: thing.type
    });

    marker.on('dragstart', function(e) {
      e.target.thing.dragging = true;
    });
    marker.on('dragend', function(e) {
      state.socket.emit('move', {
        conference: conference,
        id: e.target.thing.id,
        lat: e.target._latlng.lat,
        lng: e.target._latlng.lng
      });
      e.target.thing.dragging = false;
    });
  };

  marker.thing = thing;
  marker.thing.dragging = false;
  state.markers[thing.id] = marker;
  state.markers[thing.id].addTo(state.map);

  $('#l' + thing.id).attr('class', thing.type);
  $('#i' + thing.id).attr('src', getImgSrc(thing));
};

var changedType = function(thing) {
  if(thing.type[0] == 'x') {
    var label = 'The zombies have smashed up the Dubstep player!'
    if(thing.type == 'xbeer') {
      label = 'The humans have drunk all the free beer!';
    }
    $('.ticker > h2').text(label);

    state.map.removeLayer(state.markers[thing.id]);
    delete state.markers[thing.id];
    
    return;
  };

  $('.ticker > h2').text('Oh no, the zombies got ' + state.markers[thing.id].thing.name + '...')
  $('#l' + thing.id).attr('class', thing.type);
  $('#i' + thing.id).attr('src', getImgSrc(thing));
  state.map.removeLayer(state.markers[thing.id]);
  delete state.markers[thing.id];
  return stepOne(thing);
};

var moved = function(thing) {
  if (!state.markers[thing.id].thing.dragging) {
    state.markers[thing.id].setLatLng([thing.lat, thing.lng]);
    state.markers[thing.id].update();
  }
};

var stepOne = function(thing) {
  if (!state.markers[thing.id]) {
    firstTime(thing);
  } else if (state.markers[thing.id].thing.type !== thing.type) {
    changedType(thing);
  } else {
    moved(thing);
  }
};

var step = function(things) {
  if (state.stepping) {
    console.log('busy...');
    return;
  }

  state.stepping = true;
  for (var i = 0; i < things.length; ++i) {
    stepOne(things[i]);
  };
  state.stepping = false;
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

  $('#conference-name').text('Zombies at ' + details.conference.title + ' !!');
  state.socket.on('step', step);
};

function addHumanInfluencer() {
  state.socket.emit('add', {
    conference: conference,
    type: 'beer'
  });
};

function addZombieInfluencer() {
  state.socket.emit('add', {
    conference: conference,
    type: 'dubstep'
  });
};

$(function() {
  state.socket = io.connect();
  state.socket.on('connect', function() {
    state.socket.on('details', details);
    state.socket.emit('subscribe', {
      conference: conference
    });
  });

  $('#attract-humans').click(addHumanInfluencer);
  $('#attract-zombies').click(addZombieInfluencer);
});
