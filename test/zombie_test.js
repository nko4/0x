var assert = require('assert'),
    Person = require('../lib/person'),
    Zombie = require('../lib/zombie');

describe('zombie', function() {
    describe('getBehaviours', function() {
        it('should have two behaviours', function() {
            var p = new Person('TEST', 1, 2);
            var z = new Zombie(p);
            var behaviours = z.getBehaviours();
            assert.equal(behaviours.length, 2);
        });
    });
});
