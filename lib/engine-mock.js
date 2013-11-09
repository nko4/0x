var engine = {};

// data === name, attendees, location, ...?                                                                      
engine.start = function(data, done) {
  console.log('engine.start', data);
  return done();
};

engine.stop = function(id, done) {
  console.log('engine.stop', id);
  return done();
};

engine.step = function(id, done) {
  console.log('engine.step', id);
  return done(null, {});
};

module.exports = engine;
