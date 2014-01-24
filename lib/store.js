var _ = require('underscore'),
  async = require('async'),
  crypto = require('crypto'),
  fs = require('fs'),
  img = require('./img'),
  lanyrd = require('lanyrd');

var store = {
  cache: {}
};

function getId(s) {
  return crypto.createHash('md5').update(s).digest("hex");
};

function mapDetails(spec, conference, speakers, attendees, done) {
  if (conference.primary_venue && conference.primary_venue.latitude) {
    spec.lat = +conference.primary_venue.latitude;
    spec.lng = +conference.primary_venue.longitude;
  }

  if (!spec.lat || !spec.lng) {
    spec.lat = 51.75202;
    spec.lng = -1.25773;
  }

  var results = {
    conference: {
      id: spec.id,
      title: conference.title,
      location: {
        lat: +spec.lat,
        lng: +spec.lng
      }
    },
    attendees: []
  };
  var all = speakers.concat(attendees);
  all = _.uniq(all, function(item) {
    return item.title;
  });
  all = _.sortBy(all, function(item) {
    return item.title;
  });

  async.map(all, function(peep, cb) {
    img.init(peep.title, peep.image, function(e, id) {
      return cb(e, {
        id: id,
        name: peep.title
      });
    });
  }, function(e, mapped) {
    results.attendees = mapped;
    store.cacheIt(spec.id, results);
    return done(e, results);
  });
}

store.cacheFile = function(id) {
  return __dirname + '/../cache/' + getId(id) + '.json';
} 

store.cacheIt = function(id, details) {
  console.log('store.cacheIt - disabled');
  /*
  fs.writeFile(store.cacheFile(id), JSON.stringify(details), function(e) {
    if(e) {
      console.error(e);
    }
  });
  */
};

store.findInCache = function(id, done) {
  fs.readFile(store.cacheFile(id), function(e, d) {
    if(e) {
      return done();
    }
    console.log('store.findInCache - found it');
    return done(null, JSON.parse(d));
  }); 
};

store.getConference = function(conference, done) {
  store.findInCache(conference.id, function(e, cached) {
    if (e) {
      return done(e);
    }

    if (cached) {
      return done(null, cached);
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
      return mapDetails(conference, returns[0][1], returns[1][1], returns[2][1], done);
    });
  });
};

module.exports = store;
