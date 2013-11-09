var routes = {};

routes.init = function(app) {
  app.get('/', function(req, res) {
    res.redirect('/conference/nodeconfeu/2013/user');
  });

  app.get('/conference/:slug/:year/:user', function(req, res) {
    res.render('index.html', req.params);
  });
}

module.exports = routes;
