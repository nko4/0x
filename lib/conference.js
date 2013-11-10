var async = require('async'),
    Person = require('./person'),
    Human = require('./human'),
    Influencer = require('./influencer'),
    proj4 = require('proj4'),
    utils = require('./utils'),
    vector = require('vector2d-lib'),
    Zombie = require('./zombie');

var Conference = function() {
    this.people = [];
    this.influencers = [];
};

function proj4PointToSimple(point) {
    var ret = {}
    ret.x = point.x;
    ret.y = point.y;
    return ret;
};

function convertToWGS84(x, y) {
    var xyPoint = new proj4.Point(x, y);
    var epsg3857 = new proj4.Proj('EPSG:3857'); // google maps and osm
    var wgs84 = new proj4.Proj('EPSG:4326'); // WGS84
    var latlngPoint = proj4(epsg3857, wgs84, xyPoint);
    return proj4PointToSimple(latlngPoint);
};

function convertToEPSG3857(lng, lat) {
    var latLngPoint = new proj4.Point(lat, lng);
    var epsg3857 = new proj4.Proj('EPSG:3857'); // google maps and osm
    var wgs84 = new proj4.Proj('EPSG:4326'); // WGS84
    var xyPoint = proj4(wgs84, epsg3857, latLngPoint);
    return proj4PointToSimple(xyPoint);
};

Conference.prototype.makeZombie = function(index) {
    var human = this.people[index];
    this.people.splice(index, 1);
    var zombie = new Zombie(human);
    this.people.push(zombie);
};

// TODO does this need to be async? How fast is it?
Conference.prototype.zombiefy = function() {
    for (var i = 0; i < this.people.length; ++i) {
        var p1 = this.people[i];

        if (p1.getType() === 'zombie') {
            var closest = 9999999999;
            var nearestHuman = null;
            var indexOfNearest = -1;

            for (var j = 0; j < this.people.length; ++j) {
                var p2 = this.people[j];

                if (p1.name !== p2.name && p2.getType() === 'human') {
                    var d = vector.VectorDistance(p2.location, p1.location);
                    var deathRange = 3;
                    if (d <= deathRange && d < closest) {
                        closest = d;
                        nearestHuman = p2;
                        indexOfNearest = j;
                    }
                }
            }

            if(nearestHuman) {
                this.makeZombie(indexOfNearest);
            }
        }
    }
};

Conference.prototype.init = function(data, done) {
    if (!data.conference.location) {
        return done('no location set');
    }

    this.id = data.conference.id;
    this.people = [];
    this.location = data.conference.location;
    this.EPSG3857 = convertToEPSG3857(data.conference.location.lng, data.conference.location.lat);
    this.boundary = 1000; //metres

    // initialise people
    // TODO async?
    if (data.attendees) {
        for (var i = 0; i < data.attendees.length; ++i) {
            var x = this.EPSG3857.x + utils.getRandom(-1 * this.boundary, this.boundary);
            var y = this.EPSG3857.y + utils.getRandom(-1 * this.boundary, this.boundary);
            var p = new Human(data.attendees[i].id, x, y);
            this.people.push(p);
        }
    }

    // TODO test
    // infect!
    var infectedIndex = utils.getRandomInt(0, this.people.length - 1);
    this.makeZombie(infectedIndex);

    return done();
};

Conference.prototype.getThings = function(done) {
    var data = [];
    for (var i = 0; i < this.people.length; ++i) {
        var pp = this.people[i];
        var latlng = convertToWGS84(pp.location.x, pp.location.y);
        var p = {
            id: pp.name,
            lng: latlng.y,
            lat: latlng.x,
            type: pp.getType()
        };
        data.push(p);
    }

    for (var j = 0; j < this.influencers.length; ++j) {
        var ii = this.influencers[j];
        var latlng = convertToWGS84(ii.location.x, ii.location.y);
        var inf = {
            id: ii.id,
            lng: latlng.y,
            lat: latlng.x,
            type: ii.type
        };
        data.push(inf);
    }

    return done(null, data);
};

Conference.prototype.step = function(done) {
    this.zombiefy();
    var people = this.people;
    var influencers = this.influencers;

    async.each(people, function(p, cb) {
        p.applyBehaviours(people, influencers, function(e) {
            p.step();
            return cb();
        });
    }, function(e) {
        return done(e);
    });
};

Conference.prototype.add = function(influencer, done) {
  var x = this.EPSG3857.x + utils.getRandom(-1 * this.boundary, this.boundary);
  var y = this.EPSG3857.y + utils.getRandom(-1 * this.boundary, this.boundary);
  var i = new Influencer(influencer.id, influencer.type, x, y);
  this.influencers.push(i);
  return done();
};

module.exports = Conference;
