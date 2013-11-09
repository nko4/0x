var express = require('express'),
  app = express(),
  routes = require('./lib/routes'),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);

require('nko')('OsOQBZoKPwLCYTav');

app.use(express.static(__dirname + '/static'));
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/views');

routes.init(app);

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

// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
/*
http.createServer(function (req, res) {
  // http://blog.nodeknockout.com/post/35364532732/protip-add-the-vote-ko-badge-to-your-app
  var voteko = '<iframe src="http://nodeknockout.com/iframe/0x" frameborder=0 scrolling=no allowtransparency=true width=115 height=25></iframe>';

  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('<html><body>' + voteko + '</body></html>\n');
}).listen(port, function(err) {
  if (err) { console.error(err); process.exit(-1); }

  // if run as root, downgrade to the owner of this file
  if (process.getuid() === 0) {
    require('fs').stat(__filename, function(err, stats) {
      if (err) { return console.error(err); }
      process.setuid(stats.uid);
    });
  }

  console.log('Server running at http://0.0.0.0:' + port + '/');
});
*/
