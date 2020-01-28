'use strict';
const CONTAINERS_URL = '/api/containers/';
const uuidv4 = require('uuid/v4');
let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;
const fs = require('fs');
const path = require('path');

module.exports = function(Files) {
  let modifier = '';

  Files.beforeRemote('**', function(context, unused, next) {
    modifier = context.req.connection.remoteAddress;
    next();
  });

  Files.upload = function(ctx, options, cb) {
    function createActionRecord(fileObj, obj) {
      // console.log('>>>> fileObj', fileObj, obj);
      let query = 'insert into actions (uuid, description, ' +
        'files_id, startDate, endDate, ' +
        'duration, json, creationDate, createdBy, ' +
        'modificationDate, modifiedBy) \nvalues (' +
        '\'' + uuidv4() + '\', ' +
        '\'' + fileObj.fields.description[0] + '\', ' +
        '\'' + obj.id + '\', ' +
        'now(), ' +
        'now(), ' +
        '\'' + fileObj.fields.effort[0] + '\',' +
        '\'' + fileObj.fields.json[0] + '\',' +
        'now(), ' +
        '\'' + modifier + '\', ' +
        'now(), ' +
        '\'' + modifier + '\')';
      let params = [];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
          cb(null, err);
        } else {
          let actionId = data.insertId;
          obj.actionId = actionId;
          let query = 'insert into tasks_with_actions (' +
            'tasks_id, actions_id, ' +
            'creationDate, createdBy, ' +
            'modificationDate, modifiedBy) \nvalues (' +
            '\'' + fileObj.fields.taskId[0] + '\', ' +
            '\'' + actionId + '\', ' +
            'now(), ' +
            '\'' + modifier + '\', ' +
            'now(), ' +
            '\'' + modifier + '\')';
          let params = [];
          ds.connector.execute(query, params, function(err, data) {
            if (err) {
              console.log(err);
              cb(null, err);
            } else {
              cb(null, obj);
            }
          });
        }
      });
    }

    if (!options) options = {};
    ctx.req.params.container = 'tmp';
    let newPath = 'common';

    Files.app.models.container.upload(
      ctx.req,
      ctx.result,
      options,
      function(err, fileObj) {
        if (err || !fileObj) {
          cb(err);
        } else {
          var fileInfo = fileObj.files.file[0];

          let oldFilename = fileInfo.name;
          let extension = path.extname(oldFilename);
          let newFilename = uuidv4() + extension;

          fs.rename('./storage/tmp/' + oldFilename,
            './storage/' + newPath + '/' + newFilename,
            function() {
              Files.create({
                name: fileInfo.name,
                type: fileInfo.type,
                container: fileInfo.container,
                url: CONTAINERS_URL + 'common' +
                  '/download/' + newFilename,
              }, function(err, obj) {
                if (err !== null) {
                  cb(err);
                } else {
                  obj.newFilename = newFilename;
                  obj.newPath = newPath;
                  createActionRecord(fileObj, obj);
                }
              });
            });
        }
      });
  };

  Files.remoteMethod(
    'upload',
    {
      description: 'Uploads a file',
      accepts: [
        {arg: 'ctx', type: 'object', http: {source: 'context'}},
        {arg: 'options', type: 'object', http: {source: 'query'}},
      ],
      returns: {
        arg: 'fileObject', type: 'object', root: true,
      },
      http: {verb: 'post'},
    });
};
