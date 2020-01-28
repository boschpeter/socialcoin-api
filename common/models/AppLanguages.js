'use strict';
const uuidv4 = require('uuid/v4');

module.exports = function(AppLanguages) {
  // Add extension code here
  AppLanguages.beforeRemote('create', function(context, unused, next) {
    context.args.data.uuid = uuidv4();
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  AppLanguages.disableRemoteMethodByName('deleteById');
};
