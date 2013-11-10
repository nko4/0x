var assert = require('assert'),
    Person = require('../lib/person'),
    Human = require('../lib/human');

describe('human', function() {
    describe('getBehaviours', function() {
        it('should have behaviours', function() {
            var p = new Person('TEST', 1, 2);
            var h = new Human(p);
            var behaviours = h.getBehaviours();
            assert.equal(behaviours.length, 3);
        });
    });
});
