var AWS = require('aws-sdk');
var _ = require('lodash');
var config = require('../config');

exports.createService = function(config) {
  var s3 = new AWS.S3(config.aws);

  return {
    publish: function(id, payload, cb) {
      s3.putObject({
        Bucket: config.s3.bucket,
        Key: id,
        ACL: config.s3.acl || 'authenticated-read',
        Body: stringify(payload, cb),
        ContentType: 'application/json'
      }, cb);
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
