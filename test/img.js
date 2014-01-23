var assert = require('assert'),
  request = require('request'),
  sinon = require('sinon'),
  img = require('../lib/img');

describe('img', function() {
  describe('init with known head', function() {
    before(function(done) {
      return img.init('Roy Lines', 'https://d8142femxnlg1.cloudfront.net/cropped-profile-photos/ec685d3d24a6b0cced1afdd74b68dea9eb80d69b-s48.jpeg', done);
    });

    it('init should create normal head', function(done) {
      request('http://0.0.0.0:8000/heads/7bc48a40bec415b460234fc21a5344e7-n.jpg', function(e, r, b) {
        assert.equal(e, null);
        assert.equal(r.statusCode, 200);
        return done();
      });
    });
    
    it('init should create zombie head', function(done) {
      request('http://0.0.0.0:8000/heads/7bc48a40bec415b460234fc21a5344e7-z.jpg', function(e, r, b) {
        assert.equal(e, null);
        assert.equal(r.statusCode, 200);
        return done();
      });
    });
  });
});
