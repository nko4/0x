var express = require('express'),
  app = express(),
  routes = require('./lib/routes'),
  sockets = require('./lib/sockets'),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);

var isProduction = (process.env.NODE_ENV === 'production');
var port = (process.env.PORT || isProduction ? 80 : 8000);

require('nko')('OsOQBZoKPwLCYTav');

app.use(express.static(__dirname + '/static'));
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');

routes.init(app);
sockets.init(io);

server.listen(port, function(e) {
  if(e) {
    console.error(e);
    process.exit(-1);
  }
  
  // RL - don't know whether we need this - leave it in for now
  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
} );

