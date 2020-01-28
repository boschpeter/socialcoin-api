'use strict';
const uuidv4 = require('uuid/v4');
let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(Debts) {
  // Add extension code here
  Debts.beforeRemote('create', function(context, unused, next) {
    context.args.data.uuid = uuidv4();
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;

    next();
  });

  Debts.afterRemote('find', function(context, unused, next) {
    // filter example: {"where":{"and":[{"relationId":57},{"or":[{"statusId":0},{"statusId":34}]}]}}
    let where = context.args.filter.where;
    let and = where.and;
    let relationId = 0;
    let statusIds = [];
    let clause = '';
    for (let i = 0; i < and.length; i++) {
      let arg = and[i];
      if (arg.relationId !== undefined) {
        relationId = arg.relationId;
      }
      if (arg.or) {
        let or = arg.or;
        for (let j = 0; j < or.length; j++) {
          if (or[j].statusId) {
            statusIds.push(or[j].statusId);
          }
        }
      }
    }
    let statusId = statusIds.join(', ');
    if (statusIds.length > 0) {
      clause = ' and s.id in (' + statusId + ')\n';
    }

    let debts = {};
    let query = 'select sum(debt_lc) debtsLc\n' +
      'from debts d\n' +
      'where relations_id = ' + relationId;
    // console.log('>>>>>', query)
    let params = [1];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        debts = data;
        context.result = {};
        context.result.debts = debts;

        // let query = 'select sum(tr.amount_euro) amountLc,\n' +
        //   'sum(tr.amount_sc) amountSc \n' +
        //   ', s.id statusId\n' +
        //   ', s.name statusName\n' +
        //   'from transactions tr, \n' +
        //   'tasks t,\n' +
        //   'tasks_with_status swt,\n' +
        //   'status s\n' +
        //   'where \n' +
        //   't.relations_id=' + relationId + '\n' + clause +
        //   'and t.id=tr.tasks_id\n' +
        //   'and t.id=swt.tasks_id\n' +
        //   'and s.id=swt.status_id\n' +
        //   'group by s.id;';

        let query = 'select 0 amountLc,\n' +
        'sum(t.value_sc) amountSc \n' +
        ', s.id statusId\n' +
        ', s.name statusName\n' +
        'from tasks t,\n' +
        'tasks_with_status swt,\n' +
        'relations_with_tasks rwt,\n' + 
        'status s\n' +
        'where \n' +
        'rwt.relations_id=' + relationId + '\n' + clause +
        'and t.id=swt.tasks_id\n' +
        'and s.id=swt.status_id\n' +
        'and t.id=rwt.tasks_id\n' +
        'group by s.id;';

        console.log('>>>>>', query);
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            let payedOffLc = 0;
            let payedOffSc = 0;
            for (let i = 0; i < data.length; i++) {
              if (data[i].statusId === 34) {
                payedOffLc = data[i].amountLc;
                payedOffSc = data[i].amountSc;
              }
            }
            let balanceLc = null;
            if (context.result.debts[0].debtsLc) {
              balanceLc = context.result.debts[0].debtsLc - payedOffLc;
            }

            context.result.balanceLc = balanceLc;
            context.result.payedOffLc = payedOffLc;
            context.result.payedOffSc = payedOffSc;
            context.result.transactions = data;
            console.log('>>>>>', context.result);

            next();
          }
        });
      }
    });
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
// Disabled remote methods
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
    Debts.disableRemoteMethodByName(methods[i]);
  }
};
