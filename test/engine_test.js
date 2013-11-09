var assert = require('assert'),
    engine = require('../lib/engine');

describe('engine', function() {
    beforeEach(function() {
        engine.conferences = {};
    });

    describe('start', function() {
        it('should create new conference', function(done) {
            engine.start({
                id: 'TEST'
            }, function(e) {
                assert.equal(Object.keys(engine.conferences).length, 1);
                assert(engine.conferences.TEST);
                return done();
            });
        });
    });

    describe('stop', function() {
        it.skip('should destroy conference', function(done) {
            var data1 = {id: '1'};
            var data2 = {id: '2'};
            var data3 = {id: '3'};

            engine.start(data1, function() {
                engine.start(data2, function() {
                    engine.start(data3, function() {
                        engine.stop('2', function(e) {
                            assert.equal(Object.keys(engine.conferences).length, 2);
                            assert.equal(engine.conferences['1'].id, '1');
                            assert.equal(engine.conferences['3'].id, '3');
                            return done();
                        });
                    });
                });
            });
        });
    });

    describe('step', function() {
        it('should return positions of all people', function(done) {
            return done();
        });
    });
});
