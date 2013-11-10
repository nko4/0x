var Person = require('./person'),
    perlin = require('perlin-noise'),
    utils = require('./utils'),
    vector = require('vector2d-lib');

var Zombie = function(person) {
    this.range = 50;
    this.noise = perlin.generatePerlinNoise(200, 200);
    this.noiseIndex = 0;
    var zombieMaxSpeed = person.maxspeed;
    Person.call(this, person.name, person.location.x, person.location.y, zombieMaxSpeed);
};

Zombie.prototype = new Person();
Zombie.prototype.constructor = Zombie;

function seekDubStep(z, people, influencers, done) {
    return z.getNearest(z.location, influencers, 'dubstep', function(e, nearest) {
        if(nearest) {
            return done(e, z.seek(nearest.location));
        } else {
            return done(e, new vector(0, 0));
        }
    });
}

function seekHuman(z, people, influencers, done) {
    return z.getNearest(z.location, people, 'human', function(e, nearest) {
        if(nearest) {
            return done(e, z.seek(nearest.location));
        } else {
            return done(e, new vector(0, 0));
        }
    });
};

function random(z, people, influencers, done) {
    var max = 10;
    var force = new vector(utils.getRandomFromNoise(-1 * max, max), utils.getRandomFromNoise(-1 * max, max));
    return done(null, force);
};

Zombie.prototype.getType = function() {
    return 'zombie';
};

Zombie.prototype.getBehaviours = function(people) {
    return [seekHuman, random];
};

module.exports = Zombie;
