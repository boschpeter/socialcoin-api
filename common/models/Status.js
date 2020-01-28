'use strict';
const uuidv4 = require('uuid/v4');

var server = require('../../server/server.js');
var ds = server.dataSources.socialcoinDb;

module.exports = function(Status) {
  // Add extension code here

  Status.beforeRemote('create', function(context, unused, next) {
    context.args.data.uuid = uuidv4();
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  Status.afterRemote('**', function(context, unused, next) {
    // context.result = [{'a': 1}];

    var query = 'select s1.id fromId, s1.name ' +
      'fromName, s2.id toId, s2.name toName\n' +
      'from status s1, status s2, socialcoin.status_flows sf\n' +
      'where s1.uuid=sf.status_uuid\n' +
      'and s2.uuid=sf.status_uuid1\n' +
      // 'and s1.id>$1\n' +
      'order by s1.displayOrder';
    var params = [1];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('>>>>>', data);
      }
    });

    console.log('>>>>> afterRemote', context.method.name);
    next();
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  Status.disableRemoteMethodByName('deleteById');
};
