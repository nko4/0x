var sandbox = require('sandboxed-module'),
    assert = require('assert'),
    sinon = require('sinon');

var Conference = function() {};
Conference.prototype.init = function(data, done) {
    this.id = data.id;
    return done();
};

Conference.prototype.getThings = sinon.stub().yields();

var engine = sandbox.require('../lib/engine', {
    requires: {
        './conference': Conference
    }
});

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

        it.skip('should not create a new conference if one has already been started with that id', function(done) {
            return done('TODO');
        });
    });

    describe('stop', function() {
        it('should destroy conference', function(done) {
            var data1 = {
                id: '1'
            };
            var data2 = {
                id: '2'
            };
            var data3 = {
                id: '3'
            };

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
        it('should return positions of all people in requested conference', function(done) {
            var stub1 = sinon.stub().yields();
            var stub2 = sinon.stub().yields();

            engine.conferences.ID1 = {
                getThings: stub1
            };

            engine.conferences.ID2 = {
                getThings: stub2
            };

            engine.step('ID1', function(e, data) {
                assert(stub1.calledOnce);
                assert(!stub2.called);
                return done();
            });
        });
    });
});
