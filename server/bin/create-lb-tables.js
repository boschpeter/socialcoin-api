/**
 * Creating a database schema from models
 * @see https://loopback.io/doc/en/lb3/Creating-a-database-schema-from-models.html
 */
'use strict';

let server = require('../server');
let ds = server.dataSources.securityDb;
let lbTables = ['User', 'AccessToken', 'ACL', 'RoleMapping', 'Role'];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' + lbTables + '] created in ',
    ds.adapter.name);
  ds.disconnect();
});
