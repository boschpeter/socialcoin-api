'use strict';

module.exports = function(TasksWithSkills) {
  // Add extension code here
  TasksWithSkills.beforeRemote('create', function(context, unused, next) {
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  TasksWithSkills.disableRemoteMethodByName('deleteById');
};
