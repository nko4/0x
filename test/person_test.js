var assert = require('assert'),
    Person = require('../lib/person.js');

describe('Person', function() {
    describe('constructor', function() {
        it('should set coordinates', function() {
            var p = new Person('TEST', 42, 84);
            assert.equal(p.x, 42);
            assert.equal(p.y, 84);
        });
    });
});
