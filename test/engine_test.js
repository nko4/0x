var sandbox = require('sandboxed-module'),
    assert = require('assert'),
    sinon = require('sinon');

var engine = require('../lib/engine');

var Conference = function() {};
Conference.prototype.init = function(data, done) {
    this.id = data.conference.id;
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
                conference: {
                    id: 'TEST'
                }
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
                conference: {
                    id: '1'
                }
            };

            var data2 = {
                conference: {
                    id: '2'
                }
            };

            var data3 = {
                conference: {
                    id: '3'
                }
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
        it('should call getThings and step on requested conference', function(done) {
            var stub1 = sinon.stub().yields();
            var stub11 = sinon.stub().yields();
            var stub2 = sinon.stub().yields();
            var stub22 = sinon.stub().yields();

            engine.conferences.ID1 = {
                getThings: stub1,
                step: stub11
            };

            engine.conferences.ID2 = {
                getThings: stub2,
                step: stub22
            };

            engine.step('ID1', function(e, data) {
                assert(stub1.calledOnce);
                assert(stub11.calledOnce);
                assert(!stub2.called);
                assert(!stub22.called);
                return done();
            });
        });
    });
    
});
