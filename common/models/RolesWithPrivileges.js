'use strict';

module.exports = function(RolesWithPrivileges) {
  // Add extension code here
  RolesWithPrivileges.beforeRemote('create', function(context, unused, next) {
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  RolesWithPrivileges.disableRemoteMethodByName('deleteById');
};
