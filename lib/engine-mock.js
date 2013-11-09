var engine = {};

engine.data;
var attendees = [];

engine.start = function(data, done) {
  console.log('engine.start (MOCKED)', data.id);
  if (engine.data) {
    return done();
  }

  engine.data = data;

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
  for (var i = 0; i < attendees.length; ++i) {
    if (attendees[i].type != 'brains' && attendees[i].type != 'stickers') {
      attendees[i].lat = attendees[i].lat + (Math.random() * 2 - 1) * 0.0002;
      attendees[i].lng = attendees[i].lng + (Math.random() * 2 - 1) * 0.0002;
      if (Math.random() < 0.001) {
        attendees[i].type = "zombie"
      }
    }
  }

  return done(null, attendees);
};

engine.add = function(id, data, done) {
  console.log('engine.add', { id: id, data: data });
  // this method should add to the list of influencers and will be returned on the next step.
  // id is the id of the conference
  // data is the data for the influencer - of the form:
  // {
  //  id: 'some id',
  //  type: 'sticker' (or 'brains')
  // }
  data.lat = engine.data.conference.location.lat;
  data.lng = engine.data.conference.location.lng
  attendees.push(data);
  return done();
};

engine.move = function(id, thing, done) {
  // this method is used to move stickers or brains from the ui. Only things of type 'brains' or 'stickers' can be moved
  // params:
  // id: the conference id,
  // thing: the thing - of the form 
  // {
  //  id: 'thing id',
  //  lat: the lat to move to
  //  lng: the lng to move to
  // }
  return done();
};


module.exports = engine;
