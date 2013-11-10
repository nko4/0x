var Conference = require('./conference');

var engine = {};

engine.conferences = {};

engine.start = function(data, done) {
    console.log('engine.start');
    if (engine.conferences[data.conference.id]) {
        return done();
    }
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
    if (!engine.conferences[id]) {
        return done('conference not running');
    }

    engine.conferences[id].step(function(e) {
        engine.conferences[id].getThings(function(e, things) {
            return done(e, things);
        });
    });
};

engine.add = function(id, data, done) {
    // this method is for adding an influencer. It should be randomly added somewhere and returned in the next call to step.
    // there are two types, stickers and brains. Stickers attract humans, brains attract zombies.
    // params:
    // id: the conference id
    // data: the data for the influencer - of the form:
    // {
    //  id: 'thing id',
    //  type: 'sticker' (or 'brains')
    // }
    if (!engine.conferences[id]) {
        return done('conference not running');
    }

    return engine.conferences[id].add(data, done);
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
    if (!engine.conferences[id]) {
        return done('conference not running');
    }

    return engine.conferences[id].move(thing, done);
};

module.exports = engine;
