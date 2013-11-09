var engine = {};

engine.start = function(data, done) {
  console.log('engine.start (MOCKED)', data);
  return done();
};

engine.stop = function(id, done) {
  console.log('engine.stop (MOCKED)', id);
  return done();
};

engine.step = function(id, done) {
  console.log('engine.step (MOCKED)', id);
  return done(null, {});
};

module.exports = engine;
