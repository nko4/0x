var store = {};

store.getConference = function(id, done) {
  var details = {
    conference: {
      id: id,
      lat: 51.75202,
      lng: -1.25773
    },
    attendees: [{
        id: 'aadjffhffdkdss'
      }, {
        id: 'sahfjfdjhfg'
      }
    ]
  }
  return done(null, details);
};

module.exports = store;
