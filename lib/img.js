var crypto = require('crypto'),
  fs = require('fs'),
  gm = require('gm'),
  request = require('request');

var img = {};

function getId(url) {
  return crypto.createHash('md5').update(url).digest("hex");
};

function getPeep(id, type) {
  var dir = __dirname + '/../static/heads';
  return dir + '/' + id + '-' + type + '.jpg';
};

function peepExists(id, done) {
  return fs.exists(getPeep(id, 'z'), done);
};

function zombify(id, done) {
  gm(getPeep(id, 'n'))
    .write(getPeep(id, 'z'), done);
}

function normalise(id, done) {
  gm(getPeep(id, 'o'))
    .resize(40, 40)
    .noProfile()
    .contrast(-6)
    .write(getPeep(id, 'n'), done);
}

function processPeep(e, id, done) {
  if (e) {
    return done(e);
  }
  normalise(id, function(e) {
    if (e) {
      return done(e);
    }
    zombify(id, function(e) {
      return done(e, id);
    });
  });
};

function process(id, uri, done) {
  var dest = fs.createWriteStream(getPeep(id, 'o')).on('finish', function(e) {
    return processPeep(e, id, done);
  }).on('error', done);

  return request(uri).pipe(dest);
};

img.init = function(uri, done) {
  var id = getId(uri);
  peepExists(id, function(exists) {
    if (exists) {
      return done(null, id);
    } else {
      return process(id, uri, done);
    }
  });
};

module.exports = img;
