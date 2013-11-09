var Conference = require('./conference');

var engine = {};

engine.conferences = {};

// data === name, attendees, location, ...?                                                                      
engine.start = function(data, done) {
    console.log('engine.start', data);
    // TODO check conference isn't started
    var conference = new Conference();
    conference.init(data, function(e) {
        if(e) {
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

// [{id: '1', lat: 51, lng: -1, type: 'person'}];  
engine.step = function(id, done) {
    console.log('engine.step', id);

    engine.conferences[id].getThings(function(e, things) {
        return done(e, things);
    });
};

module.exports = engine;
