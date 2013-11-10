var assert = require('assert'),
    Person = require('../lib/person.js'),
    sinon = require('sinon'),
    vector = require('vector2d-lib');

describe('Person', function() {
    describe('constructor', function() {
        it('should set initialise', function() {
            var p = new Person('TEST', 42, 84, 5);
            assert.equal(p.location.x, 42);
            assert.equal(p.location.y, 84);
            assert.equal(p.maxspeed, 5);
            assert.deepEqual(p.acceleration, new vector(0, 0));
            assert.deepEqual(p.velocity, new vector(0, 0));
            var p2 = new Person('TEST', 42, 84);
            assert(p2.maxspeed >= 1);
            assert(p2.maxspeed <= 5);
        });
    });

    describe('step', function() {
        it.skip('should change location correctly', function() {
            var p = new Person('TEST', 0, 0);
            p.acceleration = new vector(1, 2);
            p.step();
            assert.deepEqual(p.location, new vector(1, 2));
        });
    });

    describe('applyBehaviours', function() {
        it('should call each behaviour', function(done) {
            var p = new Person('TEST', 1, 2);
            var stub = sinon.stub().yields(null, new vector(1, 2));
            p.getBehaviours = function() {
                return [stub];
            };
            p.applyBehaviours(null, null, function(e) {
                assert(stub.calledOnce);
                return done();
            });
        });
    });

    describe('getBehaviours', function() {
        it('should have the random behaviour', function(done) {
            var p = new Person('TEST', 1, 2);
            var behaviours = p.getBehaviours();
            assert.equal(behaviours.length, 1);

            behaviours[0](null, null, null, function(e, force) {
                var max = 10;
                assert(force.x >= -1 * max);
                assert(force.x <= max);
                assert(force.y >= -1 * max);
                assert(force.y <= max);
                return done();
            });
        });
    });
});
