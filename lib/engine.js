var Conference = require('./conference');
var engine = {};

engine.conferences = {};

// data === name, attendees, location, ...?                                                                      
engine.start = function(data, done) {
  console.log('engine.start', data);
  var conference = new Conference();
  conference.init(data, function(e) {
    engine.conferences[data.id] = conference;
    return done();
  });
};

engine.stop = function(id, done) {
  console.log('engine.stop', id);
  delete engine.conferences[id];
  return done();
};

engine.step = function(id, done) {
  console.log('engine.step', id);
  var results = {};
  return done(null, results);
};


module.exports = engine;
