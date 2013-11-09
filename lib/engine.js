var Conference = require('./conference');
var engine = {};

engine.conferences = {};

// data === name, attendees, location, ...?                                                                      
engine.start = function(data, done) {
    var conference = new Conference();
    conference.init(data, function(e) {
        engine.conferences[data.id] = conference;
        return done();
    });
};

engine.stop = function(id, done) {
    delete engine.conferences[id];
    return done();
};

engine.step = function(done) {
    return done(results);
};


module.exports = engine;
