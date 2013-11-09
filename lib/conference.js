var Person = require('./person'),
    proj4 = require ('proj4');

var Conference = function() {};

function convertToEPSG3857(lng, lat) {
    var latLngPoint = new proj4.Point(lat, lng);
    var epsg3857 = new proj4.Proj('EPSG:3857'); // google maps and osm
    var wgs84 = new proj4.Proj('EPSG:4326'); // WGS84
    var xyPoint = proj4(wgs84, epsg3857, latLngPoint);
    var ret = {}
    ret.x = xyPoint.x;
    ret.y = xyPoint.y;
    return ret;
};

function getRandom(from, to) {
    return Math.random(); 
};

Conference.prototype.init = function(data, done) {
    this.id = data.id;
    this.people = [];
    this.location = data.location;
    this.EPSG3857 = convertToEPSG3857(data.location.lng, data.location.lat);
    this.boundary = 1000; //metres

    // TODO async?
    if (data.people) {
        for (var i = 0; i < data.people.length; ++i) {
            var x = this.EPSG3857.x + getRandom(-1000, 1000);
            var y = this.EPSG3857.y + getRandom(-1000, 1000);
            var p = new Person(data.people[i], x, y);
            this.people.push(p);
        }
    }

    return done();
};

module.exports = Conference;
