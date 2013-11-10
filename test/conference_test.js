var assert = require('assert'),
    Conference = require('../lib/conference'),
    Human = require('../lib/human'),
    Influencer = require('../lib/influencer'),
    Person = require('../lib/person'),
    sinon = require('sinon'),
    Zombie = require('../lib/zombie');

describe('Conference', function() {
    describe('checkForInfluencerExpiration', function() {
        it('should delete influencer when people arrive', function(done) {
            var influencer = { id: 'ID1', type: 'dubstep' };
            var c = new Conference();
            c.EPSG3857 = { x: 0, y: 0 }; 
            c.add(influencer, function() {
                var x = c.influencers[0].location.x;
                var y = c.influencers[0].location.y;
                
                c.people.push(new Human('H1', x+1, y+1));
                c.people.push(new Human('H2', x+1, y+1));
                c.people.push(new Human('H3', x+1, y+1));
                c.people.push(new Human('H4', x+1, y+1));
                c.people.push(new Human('H5', x+1, y+1));
                c.people.push(new Human('H6', x+1, y+1));
                c.people.push(new Human('H7', x+1, y+1));
                c.people.push(new Human('H8', x+1, y+1));
                c.people.push(new Human('H9', x+1, y+1));
                c.people.push(new Human('H10', x+1, y+1));

                c.checkForInfluencerExpiration(function() {
                    assert.equal(c.influencers.length, 1);
                    assert.equal(c.influencers[0].getType(), 'xdubstep');
                    return done();
                });
            });
        });
    });

    describe('zombiefy', function() {
        it('should zombiefy a person', function() {
            var c = new Conference();
            var human = new Person('a', 0, 0);
            var undead = new Person('z', 1, 1);
            var zombie = new Zombie(undead);
            c.people.push(human);
            c.people.push(zombie);
            assert.equal(c.people.length, 2);
            assert.equal(c.people[0].getType(), 'human');
            assert.equal(c.people[1].getType(), 'zombie');
            c.zombiefy();
            assert.equal(c.people.length, 2);
            assert.equal(c.people[0].getType(), 'zombie');
            assert.equal(c.people[1].getType(), 'zombie');
        });

        it('should zombiefy nearest person', function() {
            var c = new Conference();
            var human1 = new Person('a', 0, 0);
            var human2 = new Person('a', 10, 10);
            var undead = new Person('z', 2, 2);
            var zombie = new Zombie(undead);
            c.people.push(human1);
            c.people.push(human2);
            c.people.push(zombie);
            assert.equal(c.people.length, 3);
            assert.equal(c.people[0].getType(), 'human');
            assert.equal(c.people[1].getType(), 'human');
            assert.equal(c.people[2].getType(), 'zombie');
            c.zombiefy();
            assert.equal(c.people.length, 3);
            assert.equal(c.people[0].getType(), 'human');
            assert.equal(c.people[1].getType(), 'zombie');
            assert.equal(c.people[2].getType(), 'zombie');
        });
        
        it('should not zombiefy a person if too far away', function() {
            var c = new Conference();
            var human = new Person('a', 0, 0);
            var undead = new Person('z', 3, 3);
            var zombie = new Zombie(undead);
            c.people.push(human);
            c.people.push(zombie);
            assert.equal(c.people.length, 2);
            assert.equal(c.people[0].getType(), 'human');
            assert.equal(c.people[1].getType(), 'zombie');
            c.zombiefy();
            assert.equal(c.people.length, 2);
            assert.equal(c.people[0].getType(), 'human');
            assert.equal(c.people[1].getType(), 'zombie');
        });
    });

    describe('step', function() {
        it('should call applyBehaviours and step on each person', function() {
            var c = new Conference();
            var p1 = new Person('a', 0, 0);
            var p2 = new Person('b', 0, 0);
            sinon.stub(p1, 'applyBehaviours').yields();
            sinon.stub(p1, 'step');
            sinon.stub(p2, 'applyBehaviours').yields();
            sinon.stub(p2, 'step');
            c.people.push(p1);
            c.people.push(p2);
            c.step(function(e) {
                assert(p1.applyBehaviours.calledOnce);
                assert(p1.step.calledOnce);
                assert(p2.applyBehaviours.calledOnce);
                assert(p2.step.calledOnce);
            });
        });
    });

    describe('getThings', function() {
        it('should return correct data', function(done) {
            var c = new Conference();
            c.people.push(new Person('ID1', 5761184.398718763, -138013.54173531875));
            c.influencers.push(new Influencer('ID2', 'brains', 5846833.6149351075, 1506841.8246246541));
            c.getThings(function(e, data) {
                assert.equal(data[0].id, 'ID1');
                assert.equal(data[0].lng.toFixed(4), -1.2397);
                assert.equal(data[0].lat.toFixed(4), 51.7536);
                assert.equal(data[0].type, 'human');
                assert.equal(data[1].id, 'ID2');
                assert.equal(data[1].lng.toFixed(3), 13.412);
                assert.equal(data[1].lat.toFixed(3), 52.523);
                assert.equal(data[1].type, 'brains');
                return done();
            });
        });
    });

    describe('add', function() {
        it('should add an influencer at a random location within boundary', function(done) {
            var influencer = { id: 'ID1', type: 'brains' };
            var c = new Conference();
            c.EPSG3857 = { x: 0, y: 0 }; 
            c.add(influencer, function() {
                var xBoundary = 1000; // metres
                var yBoundary = 1000; // metres
                // EPSG:3857
                var oxX = 0;
                var oxY = 0;
                assert(c.influencers[0].location.x < oxX + xBoundary);
                assert(c.influencers[0].location.x > oxX - xBoundary);
                assert(c.influencers[0].location.y < oxY + yBoundary);
                assert(c.influencers[0].location.y > oxY - yBoundary);
                return done();
            });
        });
    });

    describe('move', function() {
        it('should move influencer', function(done) {
            var influencer = { id: 'ID1', type: 'brains' };
            var c = new Conference();
            c.EPSG3857 = { x: 0, y: 0 }; 
            c.add(influencer, function() {
                var initialX = c.influencers[0].location.x;
                var initialY = c.influencers[0].location.y;
                
                var data = { id: 'ID1', lat: 51.7536, lng: -1.2397 };
                c.move(data, function() {
                    var newX = c.influencers[0].location.x;
                    var newY = c.influencers[0].location.y;
                    assert.equal(newX,  5761184.398718763);
                    assert.equal(newY, -138013.54173531875);
                    return done();
                });
            });
        });
    });

    describe('init', function() {

        var data;

        beforeEach(function() {
            data = {
                conference: {
                    id: 'ID',
                    location: {
                        lat: 51.7536,
                        lng: -1.2397
                    }
                },
                attendees: [{
                        id: 'PERSON1'
                    }
                ]
            };
        });

        it('should create a person for each name passed in', function(done) {
            var c = new Conference();
            c.init(data, function() {
                assert.equal(c.people.length, 1);
                assert.equal(c.people[0].name, 'PERSON1');
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

        it('should error if no location set', function(done) {
            var c = new Conference();
            delete data.conference.location;
            c.init(data, function(e) {
                assert.equal(e, 'no location set');
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
                assert(c.people[0].location.x < oxX + xBoundary);
                assert(c.people[0].location.x > oxX - xBoundary);
                assert(c.people[0].location.y < oxY + yBoundary);
                assert(c.people[0].location.y > oxY - yBoundary);
                return done();
            });
        });
    });
});
