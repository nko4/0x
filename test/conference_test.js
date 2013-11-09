var assert = require('assert'),
    Conference = require('../lib/conference');

describe('Conference', function() {
    describe('init', function() {
        it('should create a person for each name passed in', function(done) {
            var data = {id : 'ID', people: ['PERSON1']};
            var c = new Conference();
            c.init(data, function() {
                assert.equal(c.people.length, 1);
                return done();
            });
        });

        it('should set the id', function(done) {
            var data = {id : 'ID', people: []};
            var c = new Conference();
            c.init(data, function() {
                assert.equal(c.id, 'ID');
                return done();
            });
        });
    });
});
