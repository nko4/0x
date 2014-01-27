var crypto = require('crypto'),
  request = require('request');

var img = {};

var idmaps = {};

img.stream = function(id, stream) {
  var details = idmaps[id];
  return request(details.uri).pipe(stream);
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
