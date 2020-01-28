'use strict';

module.exports = function(TasksWithActions) {
  // Add extension code here
  TasksWithActions.beforeRemote('create', function(context, unused, next) {
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  TasksWithActions.disableRemoteMethodByName('deleteById');
};
