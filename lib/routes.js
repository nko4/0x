var routes = {};

routes.init = function(app) {
  app.get('/', function(req, res) {
    res.render('index.html');
  });

  app.get('/conference/:slug/:year/:user', function(req, res) {
    var config = {
      slug: req.params.slug,
      year: +req.params.year,
      lat: req.query.lat ? +req.query.lat : null,
      lng: req.query.lng ? +req.query.lng : null
    };
    res.render('conference.html', config);
  });
}

module.exports = routes;
