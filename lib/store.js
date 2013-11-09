var async = require('async'),
  crypto = require('crypto'),
  img = require('./img'),
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
  if (conference.primary_venue && conference.primary_venue.latitude) {
    conference.lat = +conference.primary_venue.latitude;
    conference.lng = +conference.primary_venue.longitude; 
  }

  if(!conference.lat || !conference.lng) {
    conference.lat = 51.75202;
    conference.lng = -1.25773;
  }

  var results = {
    conference: {
      id: id,
      title: conference.title,
      location: {
        lat: +conference.lat,
        lng: +conference.lng
      }
    },
    attendees: []
  };
  var all = speakers.concat(attendees);
  async.map(all, function(peep, cb) {
    img.init(peep.image, function(e, id) {
      return cb(e, {
        id: id,
        name: peep.title
      });
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
