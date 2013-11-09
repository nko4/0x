var engine = {};

var attendees = [];

engine.start = function(data, done) {
  console.log('engine.start (MOCKED)', data);
  attendees = data.attendees;
  for (var i = 0; i < attendees.length; ++i) {
    attendees[i].lat = data.conference.location.lat;
    attendees[i].lng = data.conference.location.lng;
    attendees[i].type = "human";
  };
  return done();
};

engine.stop = function(id, done) {
  console.log('engine.stop (MOCKED)', id);
  return done();
};

engine.step = function(id, done) {
  console.log('engine.step (MOCKED)', id);

  for (var i = 0; i < attendees.length; ++i) {
    attendees[i].lat = attendees[i].lat + (Math.random() * 2 - 1) * 0.0002;
    attendees[i].lng = attendees[i].lng + (Math.random() * 2 - 1) * 0.0002;
    if(Math.random() < 0.001) {
      attendees[i].type = "zombie"
    }
  }

  return done(null, attendees);
};

module.exports = engine;
