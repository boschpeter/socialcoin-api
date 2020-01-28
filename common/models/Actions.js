'use strict';
const uuidv4 = require('uuid/v4');

let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(Actions) {
  let modifier = '';
  // Add extension code here
  Actions.beforeRemote('**', function(context, unused, next) {
    modifier = context.req.connection.remoteAddress;
    next();
  });

  Actions.job = function(body, cb) {
    let result = {response: 'ok'};
    let query = 'insert into actions (';
    let columns = [];
    let values = [];
    columns.push('uuid');
    values.push('\'' + uuidv4() + '\'');
    if (body.description) {
      columns.push('description');
      values.push('\'' + (body.description || '') + '\'');
    } else {
      columns.push('description');
      values.push('\'.\'');
    }
    if (body.effort) {
      columns.push('effort');
      values.push('\'' + body.effort + '\'');
    }
    if (body.json) {
      columns.push('json');
      values.push('\'' + JSON.stringify(body.json) + '\'');
    }
    columns.push('startDate');
    values.push('now()');
    columns.push('creationDate');
    values.push('now()');
    columns.push('createdBy');
    values.push('\'' + modifier + '\'');
    columns.push('modificationDate');
    values.push('now()');
    columns.push('modifiedBy');
    values.push('\'' + modifier + '\'');
    query += columns.join(',') + ')\n values (' +
      values.join(',') + ')';
    let params = [];
    console.log('>>>>> query\n', query);
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
        cb(null, err);
        return;
      } else {
        let actionId = data.insertId;

        let query = 'insert into tasks_with_actions (' +
          'tasks_id, actions_id, creationDate, createdBy, ' +
          'modificationDate, modifiedBy) \nvalues (' +
          body.taskId + ', ' + actionId +
          ', now(), \'' + modifier + '\'' +
          ', now(), \'' + modifier + '\')';
        console.log('>>>>> query\n', query);
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
            cb(null, err);
            return;
          } else {
            if (body.statusId) {
              let query = 'update tasks_with_status set ' +
                'status_id=' + body.statusId + ',\n' +
                'modificationDate=now(),\n' +
                'modifiedBy=\'' + modifier + '\'\n' +
                'where tasks_id=' + body.taskId;
              console.log('>>>>> query\n', query);
              ds.connector.execute(query, params, function(err, data) {
                if (err) {
                  console.log(err);
                  cb(null, err);
                  return;
                } else {
                  console.log('>>>>> data', data);
                  cb(null, data);
                }
              });
            } else {
              cb(null, data);
            }
          }
        });
      }
    });
  };

  Actions.remoteMethod(
    'job', {
      http: {
        path: '/',
        verb: 'post',
      },
      returns: [
        {arg: 'taskId', type: 'number', required: true},
        {arg: 'description', type: 'string', required: true},
        {arg: 'startDate', type: 'string', required: true},
        {arg: 'endDate', type: 'string', required: true},
        {arg: 'effort', type: 'number'},
        {arg: 'json', type: 'object'},
        {arg: 'creationDate', type: 'string'},
        {arg: 'createdBy', type: 'string'},
        {arg: 'modificationDate', type: 'string'},
        {arg: 'modifiedBy', type: 'string'},
      ],
      accepts: [
        {
          arg: 'body',
          type:
            'object',
          http: {
            source: 'body',
          },
          required: true,
          description:
            'Pass an object from the example value.',
        },
      ],
      description:
        'Creates Action model for Task from Participant.',
    })
  ;

// Disabled remote methods
  let methods = [
    'confirm',
    'count',
    'create',
    'createChangeStream',
    'deleteById',
    'exists',
    'find',
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
    Actions.disableRemoteMethodByName(methods[i]);
  }
}
;
