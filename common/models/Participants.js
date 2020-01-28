'use strict';
const uuidv4 = require('uuid/v4');
let path = require('path');
let config = require('../../server/config.json');
let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

let generatePassword = require('password-generator');
let senderAddress = 'theo.theunissen1@gmail.com'; // Replace this address with your actual address

module.exports = function(Participants) {
  Participants.beforeRemote('**', function(context, unused, next) {
    console.log('>>>>>', context.method.name);
    next();
  });

  // The deleteById() operation and the corresponding REST endpoint will not be publicly available
  Participants.disableRemoteMethodByName('update');
  Participants.disableRemoteMethodByName('create');
  Participants.disableRemoteMethodByName('patchOrCreate');
  Participants.disableRemoteMethodByName('replaceOrCreate');
  Participants.disableRemoteMethodByName('upsertWithWhere');
  Participants.disableRemoteMethodByName('deleteById');
  Participants.disableRemoteMethodByName('exists');
  Participants.disableRemoteMethodByName('replaceById');
  Participants.disableRemoteMethodByName('count');
  Participants.disableRemoteMethodByName('findOne');
  Participants.disableRemoteMethodByName('createChangeStream');
  Participants.disableRemoteMethodByName('findById');
};
