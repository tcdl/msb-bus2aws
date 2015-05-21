var _ = require('lodash');
var msb = require('msb');
var debug = require('debug')('bus2aws');
var config = require('./config');
var router = exports;
var routes;

router.load = function load(newRoutes) {
  if (routes) {
    // Remove listeners for previously loaded routes
    routes.forEach(function(route) {
      route.server.close();
    });
  }

  routes = newRoutes;
  routes.forEach(function(route) {
    route.aws = _.defaults(route.aws || {}, config.aws);

    if (route.lambda) {
      route.service = require('./services/lambda').createService(route);
    } else if (route.s3) {
      route.service = require('./services/s3').createService(route);
    }

    route.server = msb.Responder.createServer(route.bus)
    .use(function(request, response, next) {
      if (route.ack) {
        response.responder.sendAck(route.ack.timeoutMs, route.ack.responsesRemaining);
      }

      if (route.response && route.service.request) {
        route.service.request(request, function(err, payload) {
          if (err) return next(err);

          response.writeHead(payload.statusCode || response.statusCode, payload.headers);
          response.end(payload.body);
        });

        return;
      }

      route.service.publish(response.responder.originalMessage.id, request, function(err, result) {
        if (!route.response) return next(err || result);

        response.writeHead(route.response.statusCode || response.statusCode, route.response.headers);
        response.end(route.response.body);
      });
    })
    .use(function(err, request, response, next) {
      if (!route.response) return debug(err);
      next(err);
    })
    .listen();
  });
};
