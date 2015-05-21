var AWS = require('aws-sdk');
var _ = require('lodash');
var config = require('../config');

exports.createService = function(config) {
  var lambda = new AWS.Lambda(config.aws);

  return {
    publish: function(id, payload, cb) {
      lambda.invoke({
        FunctionName: config.lambda.functionName,
        ClientContext: id,
        InvocationType: 'Event',
        Payload: stringify(payload, cb)
      }, cb);
    },
    request: function(payload, cb) {
      lambda.invoke({
        FunctionName: config.lambda.functionName,
        InvocationType: 'RequestResponse',
        Payload: stringify(payload, cb)
      }, function(err, result) {
        if (err) return cb(err);

        cb(null, parse(result.Payload) || '');
      });
    }
  };
};

function stringify(obj, cb) {
  try {
    return JSON.stringify(obj);
  } catch(e) {
    cb(e);
  }
}

function parse(str, cb) {
  try {
    return JSON.parse(str);
  } catch (e) {
    cb(e);
  }
}
