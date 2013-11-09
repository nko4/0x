var assert = require('assert'),
    img = require('../lib/img'),
    sinon = require('sinon'),
  store = require('../lib/store');

describe('store', function() {
  beforeEach(function() {
    store.cache = {
    };
    sinon.stub(img, 'init').yields(null, 'ID'); 
  });
  afterEach(function() {
    img.init.restore();
  });
  it.skip('should return expected for nodeconfeu', function(done) {
    var conference = {
      id: 'nodeconfeu:2013',
      slug: 'nodeconfeu',
      year: '2013'
    };
    store.getConference(conference, function(e, d) {
      assert(!e);
      assert.equal(d.conference.id, 'nodeconfeu:2013');
      assert.equal(d.attendees.length, 42);
      assert.equal(d.conference.location.lat, 52.5106);
      assert.equal(d.conference.location.lng, 13.4287);
      return done(e);
    });
  });
  it('should return expected for jsconfeu', function(done) {
    var conference = {
      id: 'jsconfeu:2013',
      slug: 'jsconfeu',
      year: '2013'
    };
    store.getConference(conference, function(e, d) {
      assert(!e);
      assert.equal(d.conference.id, 'jsconfeu:2013');
      assert.equal(d.attendees.length, 82);
      assert.equal(d.conference.location.lat, 52.5106);
      assert.equal(d.conference.location.lng, 13.4287);
      return done(e);
    });
  });
});
