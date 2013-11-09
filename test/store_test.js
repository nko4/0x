var assert = require('assert'),
  store = require('../lib/store');

describe('store', function() {
  beforeEach(function() {
    store.cache = {
    };
  });
  it('should return expected for nodeconfeu', function(done) {
    var conference = {
      id: 'nodeconfeu:2013',
      slug: 'nodeconfeu',
      year: '2013'
    };
    store.getConference(conference, function(e, d) {
      assert(!e);
      assert.equal(d.conference.id, 'nodeconfeu:2013');
      assert.equal(d.attendees.length, 42);
      return done(e);
    });
  });
});
