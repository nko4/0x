var Conference = require('./conference');

var engine = {};

engine.conferences = {};

engine.start = function(data, done) {
    console.log('engine.start');
    // TODO check conference isn't started
    var conference = new Conference();
    conference.init(data, function(e) {
        if (e) {
            return done(e);
        }

        engine.conferences[data.conference.id] = conference;
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

    engine.conferences[id].step(function(e) {
        engine.conferences[id].getThings(function(e, things) {
            return done(e, things);
        });
    });
};

module.exports = engine;
