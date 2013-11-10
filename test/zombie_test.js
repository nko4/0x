var assert = require('assert'),
    Person = require('../lib/person'),
    Zombie = require('../lib/zombie');

describe('zombie', function() {
    describe('getBehaviours', function() {
        it('should have three behaviours', function() {
            var p = new Person('TEST', 1, 2);
            var z = new Zombie(p);
            var behaviours = z.getBehaviours();
            assert.equal(behaviours.length, 3);
        });

        it('should not error when everyone is a zombie', function(done) {
            var pp = new Person('TEST1', 1, 2);
            var zz = new Zombie(pp);
            var p = new Person('TEST2', 1, 2);
            var z = new Zombie(p);
            var people = [];
            people.push(zz);
            people.push(z);
            var behaviours = z.getBehaviours();
            behaviours[0](z, people, null, function(e) {
                assert.equal(e, null);
                return done();
            });
        });
    });
});
