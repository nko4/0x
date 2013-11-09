var assert = require('assert'),
    Person = require('../lib/person.js'),
    sinon = require('sinon'),
    vector = require('vector2d-lib');

describe('Person', function() {
    describe('constructor', function() {
        it('should set initialise', function() {
            var p = new Person('TEST', 42, 84);
            assert.equal(p.location.x, 42);
            assert.equal(p.location.y, 84);
            assert.equal(p.maxspeed, 5);
            assert.deepEqual(p.acceleration, new vector(0, 0));
            assert.deepEqual(p.velocity, new vector(0, 0));
        });
    });

    describe('step', function() {

    });

    describe('applyBehaviours', function() {
        it('should call each behaviour', function(done) {
            var p = new Person('TEST', 1, 2);
            var stub = sinon.stub();
            p.getBehaviours = function() { return [stub]; }; 
            p.applyBehaviours(function(e) {
                assert(stub.calledOnce);
                return done();
            });
        });
    });
});
