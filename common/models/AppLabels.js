'use strict';

const uuidv4 = require('uuid/v4');
module.exports = function(AppLabels) {
  // Add extension code here
  AppLabels.beforeRemote('create', function(context, unused, next) {
    context.args.data.uuid = uuidv4();
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  AppLabels.disableRemoteMethodByName('deleteById');
};
