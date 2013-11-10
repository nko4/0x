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
    var max = 10;
    var force = new vector(utils.getRandomFromNoise(-1 * max, max), utils.getRandomFromNoise(-1 * max, max));
    return done(null, force);
};

function separate(p, people, influencers, done) {
   return p.separate(people, done); 
}

function runAwayFromZombies(p, people, influencers, done) {
    // TODO
    return new vector(0, 0);
};

function seekBeer(p, people, influencers, done) {
    return p.getNearest(p.location, influencers, 'beer', function(e, nearest) {
        if(nearest) {
            return done(e, p.seek(nearest.location).mult(3)); // beer is 3 times as powerful as running away from zombies
        } else {
            return done(e, new vector(0, 0));
        }
    });
}

Human.prototype.getBehaviours = function(people) {
    return [random, seekBeer, separate];
};

module.exports = Human;

