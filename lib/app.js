var msb = require('msb');
var app = exports;
var config = require('./config');
var router = require('./router');

app.start = function() {
  msb.configure(config.bus);
  if (config.channelMonitorEnabled) msb.channelMonitorAgent.start();

  router.load(config.routes);

  app.namespaces = config.routes.map(function(route) {
    return route.bus.namespace;
  });

  console.log('bus2aws listening on ' + app.namespaces.join(', '));
};
