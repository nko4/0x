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

function runAwayFromZombies(p, people, influencers, done) {
    // TODO
    return new vector(0, 0);
};

Human.prototype.getBehaviours = function(people) {
    return [random];
};

module.exports = Human;

