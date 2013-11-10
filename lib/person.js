var async = require('async'),
    utils = require('./utils'),
    vector = require('vector2d-lib');

var Person = function(name, x, y, maxspeed) {
    this.name = name;
    this.maxspeed = maxspeed || 5; // metres per what?!
    this.maxforce = 10;
    this.location = new vector(x, y);
    this.acceleration = new vector(0, 0);
    this.velocity = new vector(0, 0);
};

function random(p, people, influencers, done) {
    var max = 10;
    var force = new vector(utils.getRandom(-1 * max, max), utils.getRandom(-1 * max, max));
    return done(null, force);
};

Person.prototype.getType = function() {
    return 'human';
};

Person.prototype.getBehaviours = function() {
    return [random];
};

Person.prototype.step = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
};

Person.prototype.applyForce = function(force) {
    return this.acceleration.add(force);
};

Person.prototype.applyBehaviours = function(people, influencers, done) {
    var that = this;
    async.each(this.getBehaviours(), function(b, cb) {
        b(that, people, influencers, function(e, force) {
            that.applyForce(force);
            return cb();
        });
    }, function(e) {
        return done();
    });
};

Person.prototype.seek = function(target) {
    var desired = vector.VectorSub(target, this.location);

    desired.normalize();
    desired.mult(this.maxspeed);

    var steer = vector.VectorSub(desired, this.velocity);
    steer.limit(this.maxforce);

    return steer;
};

Person.prototype.getNearest = function(currentLocation, things, type, done) {
    var closestDistance = 999999999;
    var closestThing = null;

    for (var i = 0; i < things.length; ++i) {
        var other = things[i];
        if (other.getType() === type) {
            var distance = vector.VectorDistance(other.location, currentLocation);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestThing = other;
            }
        }
    }

    return done(null, closestThing);
};

module.exports = Person;
