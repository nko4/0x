var async = require('async'),
    crypto = require('crypto'),
  lanyrd = require('lanyrd');

var store = {
  cache: {
    a: 'a'
  }
};

function getId(s) {
  return crypto.createHash('md5').update(s).digest("hex");
};

function mapDetails(id, conference, speakers, attendees, done) {
//  console.log(conference);
  if(!conference.primary_venue || !conference.primary_venue.latitude) {
    return done('no primary venue for event');
  }

  var results = {
    conference: {
      id: id,
      title: conference.title,
      lat: +conference.primary_venue.latitude,
      lng: +conference.primary_venue.longitude
    },
    attendees: []
  };
  var all = speakers.concat(attendees);
  async.map(all, function(peep, cb) {
    return cb(null, {
      id: getId(peep.image),
      name: peep.title
      //img: peep.image
    });
  }, function(e, mapped) {
    results.attendees = mapped;
    store.cache[id] = results;
    return done(e, results);
  });
}

store.getConference = function(conference, done) {
  if (store.cache[conference.id]) {
    console.log('store.getConference - found in cache');
    return done(null, store.cache[conference.id]);
  }

  async.parallel([
    function(cb) {
      return lanyrd.event(conference.slug, conference.year, cb);
    },
    function(cb) {
      return lanyrd.speakers(conference.slug, conference.year, cb);
    },
    function(cb) {
      return lanyrd.attendees(conference.slug, conference.year, cb);
    }
  ], function(e, returns) {
    if (e) {
      return done(e);
    }
    return mapDetails(conference.id, returns[0][1], returns[1][1], returns[2][1], done);
  });
};

module.exports = store;
