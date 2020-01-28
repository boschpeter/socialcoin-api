'use strict';
let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(RelationsWithRoles) {
  // Add extension code here
  RelationsWithRoles.beforeRemote('create', function(context, unused, next) {
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  // get relations with roles if filter is applied
  // @see https://loopback.io/doc/en/lb3/Where-filter.html
  RelationsWithRoles.afterRemote('find', function(context, team, next) {
    // console.log('>>>>> afterRemote, context.method.name: ', context.method.name);
    // console.log('>>>>> afterRemote, context.args.data: ', context.args.data);
    // console.log('>>>>> afterRemote, context.args.filter: ', context.args.filter);
    let whereClause = '';
    if (!context.args.filter && !context.args.filter.rolesId) {
      let error = new Error();
      error.status = 500;
      error.message = 'rolesId must be a positive integer';
      error.code = 'NUMBER_REQUIRED';
      next(error);
    } else {
      whereClause = 'rwr.roles_id=' + context.args.filter.rolesId + ' and ';

      let query = 'select r.id relationsId,\n' +
        'concat(r.firstname, \' \', r.prefix, \' \',' +
        ' r.lastname) relationsName,\n' +
        'r.email,\n' +
        'r.phonenumber\n' +
        'from relations r\n' +
        ', relations_with_roles rwr \n' +
        ', roles ro\n' +
        'where ' + whereClause + ' r.id=rwr.relations_id\n' +
        'and ro.id=rwr.roles_id \n' +
        'group by r.id order by r.lastname, r.firstname;\n';
      // console.log('Get relations with teams, if filter is applied');
      // console.log(context.args.filter);
      let params = [];
      // console.log('>>>>> query: ', query);
      ds.connector.execute(query, params, function(error, data) {
        if (error) {
          console.log(error);
          next(error);
        } else {
          context.result = data;
          next();
        }
      });
    }
  });

  RelationsWithRoles.create = function(body, cb) {
    let relationsId = body.relationsId;
    let rolesId = body.rolesId;

    let query = 'insert into relations_with_roles (\n' +
      'relations_id, \n' +
      'roles_id, \n' +
      'createdBy, \n' +
      'creationDate, \n' +
      'modificationDate, \n' +
      'modifiedBy) values (\n' +
      relationsId + ', \n' +
      rolesId + ', \n' +
      rolesId + ', \n' +
      '\'' + new Date().toISOString() + '\', \n' +
      '\'' + context.req.connection.remoteAddress + '\', \n' +
      '\'' + new Date().toISOString() + '\', \n' +
      '\'' + context.req.connection.remoteAddress + '\')\n';
    let params = [];
    console.log('>>>>> query: ', query);
    ds.connector.execute(query, params, function(error, data) {
      if (error) {
        console.log(error);
        cb(error);
      } else {
        cb(null, {'response': 'ok'});
      }
    });
  };
  RelationsWithRoles.delete = function(body, cb) {
    let relationsId = body.relationsId;
    let rolesId = body.rolesId;

    let query = 'delete from relations_with_roles \n' +
      'where relations_id = ' + relationsId + '\n' +
      'and roles_id = ' + rolesId;
    let params = [];
    // console.log('>>>>> query: ', query);
    ds.connector.execute(query, params, function(error, data) {
      if (error) {
        console.log(error);
        cb(error);
      } else {
        cb(null, {'response': 'ok'});
      }
    });
  };
  RelationsWithRoles.remoteMethod(
    'delete', {
      http: {
        path: '/',
        verb: 'delete',
      },
      returns: [{
        arg: 'relationsId',
        type: 'Number',
      }, {
        arg: 'rolesId',
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
        'from the RelationsWithRoles model.',
    });

  RelationsWithRoles.remoteMethod(
    'create', {
      http: {
        path: '/',
        verb: 'post',
      },
      returns: [{
        arg: 'relationsId',
        type: 'Number',
      }, {
        arg: 'rolesId',
        type: 'Number',
      }],
      accepts: {
        arg: 'body',
        type: 'object',
        http: {source: 'body'},
        required: true,
        description: 'Pass an object from the example value.',
      },
      description: 'Creates a Relation with Role ' +
        'from the RelationsWithRoles model.',
    });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  // RelationsWithRoles.disableRemoteMethodByName('deleteById');
  let methods = [
    'confirm',
    'count',
    // 'create',
    'createChangeStream',
    'deleteById',
    'exists',
    // 'find',
    'findById',
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
    RelationsWithRoles.disableRemoteMethodByName(methods[i]);
  }
};
