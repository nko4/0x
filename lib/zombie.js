var Person = require('./person'),
    vector = require('vector2d-lib');

var Zombie = function(person) {
    this.range = 50;
    var zombieMaxSpeed = Math.random() * person.maxspeed;
    Person.call(this, person.name, person.location.x, person.location.y, zombieMaxSpeed);
};

Zombie.prototype = new Person();
Zombie.prototype.constructor = Zombie;

/*
function seekHumans(people) {
    var count = 0;
    var sum = new vector();

    for (var i = 0; i < people.length; ++i) {
        var other = people[i];
        if (other.getType !== 'zombie') {
            var d = vector.VectorDistance(this.location, other.location);

            if ((this.name !== other.name) && (d < this.range)) {

                var diff = vector.VectorSub(other.location, this.location);
                diff.normalize();
                diff.div(d);
                sum.add(diff);
                count++;
            }
        }
    }

    if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxspeed);
        sum.sub(this.velocity);
        sum.limit(this.maxforce);
    }

    return sum;
};
*/

Zombie.prototype.seekHuman = function(people, done) {
    return this.getNearestHuman(people, function(e, nearest) {
        return done(e, this.seek(nearest.location));
    });
};

Zombie.prototype.seek = function(target) {
    var desired = vector.VectorSub(target, this.location);

    desired.normalize();
    desired.mult(this.maxspeed);

    var steer = vector.VectorSub(desired, this.velocity);
    steer.limit(this.maxforce);

    return steer;
};

Zombie.prototype.getNearestHuman = function(people, done) {
    var closestDistance = 999999999;
    var closestHuman = null;

    for (var i = 0; i < people.length; ++i) {
        var other = people[i];
        if (other.getType() === 'human') {
            var distance = vector.VectorDistance(other.location, this.location);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestHuman = other;
            }
        }
    }

    return done(null, closestHuman);
};

Zombie.prototype.getType = function() {
    return 'zombie';
};

Zombie.prototype.getBehaviours = function(people) {
    return [this.seekHuman];
};

module.exports = Zombie;