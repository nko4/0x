var _ = require('underscore'),
    img = require('./img'),
  lanyrd = require('lanyrd');

// patch to lanyrd
lanyrd.search = function(query, cb) {
  this.get('search/?context=past&q=' + query, function(error, response, body) {
    if(!body.sections || !body.sections[0] || !body.sections[0].rows) {
      return cb('unexpected response');
    }
    return cb(error, response, body.sections[0].rows)
  })
};

var routes = {};

routes.init = function(app) {
  app.get('/', function(req, res) {
    res.render('index.html');
  });

  app.get('/heads', function(req, res) {
    if(req.headers['if-none-match'] || req.headers['if-modified-since']) {
      return res.send(304);
    }
  
    return img.stream(req.query.id, req.query.type, res);
  });

  app.get('/conference/:year/:slug', function(req, res) {
    var config = {
      slug: req.params.slug,
      year: +req.params.year,
      lat: req.query.lat ? +req.query.lat : null,
      lng: req.query.lng ? +req.query.lng : null
    };
    res.render('conference.html', config);
  });

  app.get('/conference/search', function(req, res) {
    if (!req.query.q) {
      return res.send(400);
    }
    var q = 'title:' + req.query.q;
    console.log('searching for ' + q);
    lanyrd.search(q, function(e, r, b) {
      if (e) {
        console.error(e);
        return res.send(500);
      }

      console.log(b);

      var results = _.map(b, function(result) {
        return {
          title: result.title,
          url: '/conference' + result.url
        };
      });

      res.send(results);
    });
  });
}

module.exports = routes;
