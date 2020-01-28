'use strict';

let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(RelationsWithTeams) {
  // Add extension code here
  RelationsWithTeams.beforeRemote('create', function(context, unused, next) {
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  RelationsWithTeams.afterRemote('find', function(context, unused, next) {
    console.log('>>>>> context.args.filter', context.args.filter);
    let clause = [];
    if (context.args.filter) {
      if (context.args.filter.where.relationsId) {
        clause.push('relations_id = ' + context.args.filter.where.relationsId);
      }
      if (context.args.filter.where.teamsId) {
        clause.push('teams_id = ' + context.args.filter.where.teamsId);
      }
    }
    clause = clause.join(' and\n ');
    if (clause !== '') {
      clause += ' and\n';
    }

    let query = 'select r.id relationsId,\n' +
      'r.uuid relationsUuid,\n' +
      'r. locations_id relationLocationsId,\n' +
      'r.firstname relationsFirstname,\n' +
      'r.prefix relationsPrefix,\n' +
      'r.lastname relationLastname,\n' +
      'concat(' +
      'r.firstname, \' \', r.prefix, \' \', r.lastname) relationsName,\n' +
      'r.date_of_birth relationsDateOfBirth,\n' +
      'r.phonenumber relationsPhonenumber,\n' +
      'r.email relationsEmail,\n' +
      'r.description relationsDescription,\n' +
      'r.username relationsUsername,\n' +
      'r.json relationsJson,\n' +
      't.id teamsId,\n' +
      't.name teamsName,\n' +
      't.uuid teamsUuid,\n' +
      't.description teamsDescription,\n' +
      't.json teamsJson\n' +
      'from relations_with_teams rwt\n' +
      ', relations r\n' +
      ', teams t\n' +
      'where ' + clause + ' r.id=rwt.relations_id\n' +
      'and t.id=rwt.teams_id';
    console.log('>>>>>', query);
    let params = [1];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        context.result = data;
      }
      next();
    });
  });

  RelationsWithTeams.delete = function(body, cb) {
    let relationsId = body.relationsId;
    let teamsId = body.teamsId;

    let query = 'delete from relations_with_teams \n' +
      'where relations_id = ' + relationsId + '\n' +
      'and teams_id = ' + teamsId;
    let params = [];
    console.log('>>>>> query: ', query);
    ds.connector.execute(query, params, function(error, data) {
      if (error) {
        console.log(error);
        cb(error);
      } else {
        console.log('>>>>> data', data);
        cb(null, {'response': 'ok'});
      }
    });
  };

  RelationsWithTeams.remoteMethod(
    'delete', {
      http: {
        path: '/',
        verb: 'delete',
      },
      returns: [{
        arg: 'relationsId',
        type: 'Number',
      }, {
        arg: 'teamsId',
        type: 'Number',
      }],
      accepts: {
        arg: 'body',
        type: 'object',
        http: {source: 'body'},
        required: true,
        description: 'Pass an object from the example value.',
      },
      description: 'Delete a Relation with Role ' +
        'from the RelationsWithTeams model.',
    });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  // RelationsWithTeams.disableRemoteMethodByName('deleteById');
  let methods = [
    'confirm',
    'count',
    // 'create',
    'createChangeStream',
    'deleteById',
    'exists',
    // 'find',
    // 'findById',
    'findOne',
    'patchAttributes',
    'patchOrCreate',
    'prototype.__count__accessTokens',
    'prototype.__create__accessTokens',
    'prototype.__delete__accessTokens',
    'prototype.__destroyById__accessTokens',
    'prototype.__findById__accessTokens',
    'prototype.__get__accessTokens',
    'prototype.__updateById__accessTokens',
    'prototype.updateAttributes',
    'replaceById',
    'replaceOrCreate',
    'resetPassword',
    'updateAll',
    'upsert',
    'upsertWithWhere',
  ];
  for (let i = 0; i < methods.length; i++) {
    RelationsWithTeams.disableRemoteMethodByName(methods[i]);
  }
};
