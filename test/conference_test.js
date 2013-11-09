var assert = require('assert'),
    Conference = require('../lib/conference');

describe('Conference', function() {
    describe('init', function() {

        var data = {
            id: 'ID',
            location: {
                lat: 51.7536,
                lng: -1.2397
            },
            people: ['PERSON1']
        };

        it('should create a person for each name passed in', function(done) {
            var c = new Conference();
            c.init(data, function() {
                assert.equal(c.people.length, 1);
                return done();
            });
        });

        it('should set the id', function(done) {
            var c = new Conference();
            c.init(data, function() {
                assert.equal(c.id, 'ID');
                return done();
            });
        });

        it('should set the location', function(done) {
            var c = new Conference();
            c.init(data, function() {
                assert.deepEqual(c.location, {
                    lat: 51.7536,
                    lng: -1.2397
                });
                return done();
            });
        });

        it('should set the location in EPSG3857', function(done) {
            var c = new Conference();
            c.init(data, function() {
                assert.deepEqual(c.EPSG3857, {
                    x: 5761184.398718763,
                    y: -138013.54173531875
                });
                return done();
            });
        });

        it('should set people location within conference boundary', function(done) {
            var c = new Conference();
            c.init(data, function() {
                var xBoundary = 1000; // metres
                var yBoundary = 1000; // metres
                // EPSG:3857
                var oxX = 5761184.398718763;
                var oxY = -138013.54173531875;
                assert(c.people[0].x < oxX + xBoundary);
                assert(c.people[0].x > oxX - xBoundary);
                assert(c.people[0].y < oxY + yBoundary);
                assert(c.people[0].y > oxY - yBoundary);
                return done();
            });
        });
    });
});
