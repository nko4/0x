var async = require('async'),
    vector = require('vector2d-lib');

var Person = function(name, x, y, maxspeed) {
    this.name = name;
    this.maxspeed = maxspeed || 5; // metres per what?!
    this.location = new vector(x, y);
    this.acceleration = new vector(0, 0);
    this.velocity = new vector(0, 0);
};

function random() {
    return new vector(utils.getRandom(-10, 10), utils.getRandom(-10, 10));
};

Person.prototype.getBehaviours = function() {
    return [random];
};

Person.prototype.step = function() {

};

Person.prototype.applyBehaviours = function(done) {
    async.each(this.getBehaviours(), function(b, cb) {
        var force = b();
        //this.applyForce(force);
        return cb();
    }, function(e) {
        return done();
    });
};

Person.prototype.applyForce = function(force) {
    return this.acceleration.add(force);
};

module.exports = Person;
