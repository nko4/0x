var Person = require('./person'),
    utils = require('./utils'),
    vector = require('vector2d-lib');

var Human = function(name, x, y, maxspeed) {
    this.range = 50;
    Person.call(this, name, x, y, maxspeed);
};

Human.prototype = new Person();
Human.prototype.constructor = Human;

Human.prototype.getType = function() {
    return 'human';
};

function random(p, people, influencers, done) {
    var max = 5;
    var force = new vector(utils.getRandomFromNoise(-1 * max, max), utils.getRandomFromNoise(-1 * max, max));
    return done(null, force);
};

function separate(p, people, influencers, done) {
   return p.separate(people, 50, done); 
}

function runAwayFromZombies(p, people, influencers, done) {
    return p.separate(p, 500, function(e, force) {
        return done(e, force.mult(2));
    });
};

function seekBeer(p, people, influencers, done) {
    return p.getNearest(p.location, influencers, 'beer', function(e, nearest) {
        if(nearest) {
            return done(e, p.seek(nearest.location).mult(3));
        } else {
            return done(e, new vector(0, 0));
        }
    });
}

Human.prototype.getBehaviours = function(people) {
    return [random, seekBeer, separate, runAwayFromZombies];
};

module.exports = Human;

