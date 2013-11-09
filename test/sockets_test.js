var assert = require('assert'),
  sinon = require('sinon'),
  sockets = require('../lib/sockets');

describe('sockets', function() {
  describe('rooms', function() {
    beforeEach(function() {
      sockets.io = {
        sockets: {
          manager: {
            rooms: {}
          }
        }
      };
    });
    afterEach(function() {
      delete sockets.io;
    });
    it('should return empty array if noone connected', function() {
      sockets.io.sockets.manager.rooms = {};
      assert.deepEqual(sockets.rooms(), []);
    });
    it('should return all room names', function() {
      sockets.io.sockets.manager.rooms = {
        '': ['SOCK'],
        '/room1': [],
        '/room2': []
      };
      assert.deepEqual(sockets.rooms(), ['room1', 'room2']);
    });
  });
});
