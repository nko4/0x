var async = require('async'),
    Person = require('./person'),
    proj4 = require('proj4'),
    utils = require('./utils');

var Conference = function() {
    this.people = [];
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
            var x = this.EPSG3857.x + utils.getRandom(-1000, 1000);
            var y = this.EPSG3857.y + utils.getRandom(-1000, 1000);
            var p = new Person(data.attendees[i].id, x, y);
            this.people.push(p);
        }
    }

    return done();
};

Conference.prototype.getThings = function(done) {
    // TODO  things other than people eg. influencers
    var data = [];
    for (var i = 0; i < this.people.length; ++i) {
        var pp = this.people[i];
        var latlng = convertToWGS84(pp.location.x, pp.location.y);
        var p = {
            id: pp.name,
            lng: latlng.y,
            lat: latlng.x,
            type: 'person'
        };
        data.push(p);
    }

    return done(null, data);
};

Conference.prototype.step = function(done) {
    async.each(this.people, function(p, cb) {
        p.applyBehaviours(function(e) {
            p.step();
            return cb();
        });
    }, function(e) {
        return done(e);
    });
};

module.exports = Conference;
