var crypto = require('crypto'),
  gm = require('gm'),
  request = require('request');

var img = {};

var idmaps = {};

function streamZombie(id, type, details, stream) {
  gm(request(details.uri))
    .noProfile()
    .negative()
    .borderColor('#8A0707')
    .border(3, 3)
    .stream()
    .pipe(stream);
};

function streamPeep(id, type, details, stream) {
  gm(request(details.uri))
    .noProfile()
    .borderColor('green')
    .border(3, 3)
    .stream()
    .pipe(stream);
};

/*
function streamPeep(id, type, details, stream) {
  return request(details.uri).pipe(stream);
};
*/

img.stream = function(id, type, stream) {
  var details = idmaps[id];
  if(type === 'zombie') {
    return streamZombie(id, type, details, stream);
  } else {
    return streamPeep(id, type, details, stream);
  }
};

img.init = function(name, uri, done) {
  var details = {
    name: name,
    uri: uri
  };
  
  var id = crypto.createHash('md5').update(JSON.stringify(details)).digest("hex");
  idmaps[id] = details;

  return done(null, id);
};

module.exports = img;
