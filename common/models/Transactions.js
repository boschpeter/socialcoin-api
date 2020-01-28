'use strict';
/**
 * For anyone else having that problem with loopback 3 and Postman that on POST,
 * the connection hangs (or returns ERR_EMPTY_RESPONSE) (seen in some comments here)...
 * The problem in this scenario is, that Postman uses as
 * Content-Type "application/x-www-form-urlencoded"!
 * Please remove that header and add "Accept" = "multipart/form-data".
 * I've already filed a bug at loopback for this behavior
 * @see https://stackoverflow.com/questions/28885282/how-to-store-files-with-meta-data-in-loopback
 */

const uuidv4 = require('uuid/v4');

let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(Transactions) {
  let modifier = '';
  // Add extension code here
  Transactions.beforeRemote('create', function(context, unused, next) {
    context.args.data.uuid = uuidv4();
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    modifier = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    if (context.args.data.amountEuro == undefined ||
      context.args.data.amountEuro == null) {
      context.args.data.amountEuro = 0;
    }
    if (context.args.data.amountSc == undefined ||
      context.args.data.amountSc == null) {
      context.args.data.amountSc = 0;
    }
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  Transactions.afterRemote('create', function(context, unused, next) {
    let query = 'select count(1) cnt\nfrom relations_with_tasks\n' +
      'where relations_id=' + context.result.relationsId + '\nand ' +
      'tasks_id=' + context.result.tasksId;
    // console.log('>>>>> afterRemote', query);
    let params = [];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        // console.log('>>>>> data', data[0].cnt);
        if (data[0].cnt == 0) {
          // console.log('>>>>> data', data);
          // console.log('>>>>> err', err);
          query = 'insert into relations_with_tasks (\n' +
            '  relations_id, tasks_id, creationDate, createdBy, ' +
            ' modificationDate, modifiedBy) values (\n' +
            context.result.relationsId + ', ' + context.result.tasksId + ', ' +
            'now(), \'' + modifier + '\',' +
            'now(), \'' + modifier + '\');';
          // console.log('>>>>> afterRemote', query);
          // console.log('>>>>> afterRemote context', context.result);
          let params = [];
          ds.connector.execute(query, params, function(err, data) {
            if (err) {
              console.log(err);
            } else {
              context.result = data;

              next();
            }
          });
        } else {
          next();
        }
      }
    });
  });

  Transactions.afterRemote('find', function(context, unused, next) {
    let filter = context.args.filter;
    let clause = '';
    if (filter) {
      if (filter.where && filter.where.relationId) {
        clause = ' r.id = ' + filter.where.relationId + '\nand ';
      }
    }
    let query = 'select r.id relationId,\n' +
      'r.firstname relationFirstname,\n' +
      'r.prefix relationPrefix,\n' +
      'r.lastname relationLastname,\n' +
      'concat(r.firstname, \' \', r.prefix, \' \', r.lastname) ' +
      'relationName,\n' +
      'r.phonenumber relationPhonenumber,\n' +
      'r.email relationEmail,\n' +
      'r.description relationDescription,\n' +
      'r.json relationJson,\n' +
      'l.streetname locationStreetname,\n' +
      'l.housenumber locationHousenumber,\n' +
      'l.housenumber_suffix locationHousenumberSuffix,\n' +
      'l.postalcode locationPostalcode,\n' +
      'l.city locationCity,\n' +
      't.id taskId,\n' +
      't.name taskName,\n' +
      't.description taskDescription,\n' +
      't.json taskJson,\n' +
      'tr.amount_euro transactionAmountLc,\n' +
      'tr.amount_sc transactionAmountSc,\n' +
      'tr.description transactionDescription,\n' +
      'tr.json transactionJson\n' +
      'from tasks t,\n' +
      'relations r,\n' +
      'transactions tr,\n' +
      'locations l\n' +
      'where ' + clause + 'r.id=tr.relations_id\n' +
      'and t.id=tr.tasks_id\n' +
      'and l.id=r.locations_id';
    let params = [];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        context.result = data;
        next();
      }
    });
  });

// Disabled remote methods
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
    // 'replaceById',
    'replaceOrCreate',
    'resetPassword',
    'updateAll',
    'upsert',
    'upsertWithWhere',
  ];
  for (let i = 0; i < methods.length; i++) {
    Transactions.disableRemoteMethodByName(methods[i]);
  }
};
