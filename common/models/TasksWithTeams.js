'use strict';

let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(TasksWithTeams) {
  // // Add extension code here
  TasksWithTeams.beforeRemote('create', function(context, unused, next) {
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  TasksWithTeams.beforeRemote('**', function(context, unused, next) {
    console.log('>>>>> afterRemote TasksWithTeams', context.method.name);
    next();
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  TasksWithTeams.disableRemoteMethodByName('deleteById');
};