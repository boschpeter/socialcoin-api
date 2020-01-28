'use strict';

let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(TasksWithStatus) {
  // Add extension code here
  TasksWithStatus.beforeRemote('create', function(context, unused, next) {
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  TasksWithStatus.beforeRemote('**', function(context, unused, next) {
    console.log('>>>>> afterRemote TasksWithStatus', context.method.name);

    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  //
  TasksWithStatus.afterRemote('__get__statuses',
    function(context, unused, next) {
      let query = 'select s1.id fromId, s1.name fromName, ' +
        's2.id toId, s2.name toName\n' +
        'from status s1, status s2, socialcoin.status_flows sf\n' +
        'where s1.uuid=sf.status_uuid\n' +
        'and s2.uuid=sf.status_uuid1\n' +
        // 'and s1.id>$1\n' +
        'order by s1.displayOrder';
      let params = [1];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log('>>>>>', data);
        }
      });

      console.log('>>>>> afterRemote TasksWithStatus', context.method.name);
      next();
    });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  TasksWithStatus.disableRemoteMethodByName('deleteById');
};
