'use strict';
const uuidv4 = require('uuid/v4');
let path = require('path');
let config = require('../../server/config.json');
let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

let generatePassword = require('password-generator');
let senderAddress = 'theo.theunissen1@gmail.com'; // Replace this address with your actual address

module.exports = function(Relations) {
  // Add extension code here
  let date = new Date().toLocaleString();
  let modifier;

  // send password reset link when password reset requested
  Relations.on('resetPasswordRequest', function(info) {
    var url = 'http://' + config.resetHost + ':' + config.resetPort + '/desktop/reset-password';
    var html = 'Click <a href="' + url + '?access_token=' +
      info.accessToken.id + '">here</a> to reset your password';
    // 'here' in above html is linked to : 'http://<host:port>/reset-password?access_token=<short-lived/temporary access token>'
    Relations.app.models.Email.send({
      to: info.email,
      from: info.email,
      subject: 'Password reset',
      html: html,
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      // console.log('>>>>> sending password reset email to:', info.email);
    });
  });

  Relations.beforeRemote('deleteById', function(context, unused, next) {
    console.log('>>>>>', context.args.id);
    console.log('>>>>> afterRemote', context.method.name);
    console.log('>>>>> afterRemote', context.args.data);
    console.log('>>>>> afterRemote', context.args.filter);

    const relationsId = context.args.id;

    function deleteRelatedLocation() {
      let query = 'delete from locations where id<>1 and id= ' +
        '(select locations_id from relations where id=' + relationsId + ')';
      let params = [1];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log('>>>>> query: ', query);
          console.log(err);
        } else {
          console.log('>>>>> Deleted records from locations');
        }
        deleteFromRelatedTables();
      });
    }

    function deleteFromRelatedTables() {
      let tables = ['relations_with_teams', 'relations_with_roles',
        'relations_with_tasks', 'debts',
        'transactions'];
      for (let i = 0; i < tables.length; i++) {
        let table = tables[i];
        let query = 'delete from ' + table + ' where relations_id=' +
          relationsId;
        let params = [1];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log('>>>>> query: ', query);
            console.log(err);
          } else {
            console.log('>>>>> Deleted records from ' + table);
          }
        });
      }
    }
    deleteRelatedLocation();

    next();
  });

  Relations.beforeRemote('create', function(context, unused, next) {
    if (context.args.data.debt &&
      (isNaN(parseFloat(context.args.data.debt)) ||
        parseFloat(context.args.data.debt) < 0)) {
      let error = new Error();
      error.status = 500;
      error.message = 'Debt must be a positive number';
      error.code = 'NUMBER_REQUIRED';
      next(error);
    } else if (context.args.data.rolesId &&
      (isNaN(parseInt(context.args.data.rolesId)) ||
        parseFloat(context.args.data.rolesId) < 0)) {
      let error = new Error();
      error.status = 500;
      error.message = 'rolesId must be a positive number';
      error.code = 'NUMBER_REQUIRED';
      next(error);
    } else {
      modifier = context.req.connection.remoteAddress;
      context.args.data.locationsId = 1; // placeholder, will be updated with actual location
      context.args.data.uuid = uuidv4();
      context.args.data.creationdate = date;
      context.args.data.createdby = modifier;
      context.args.data.modificationdate = date;
      context.args.data.modifiedby = modifier;
      context.args.data.password = generatePassword(12, false);

      next();
    }
  });

// send verification email after registration
  Relations.afterRemote('create', function(context, user, next) {
    let statements = 0;
    function doNext(err) {
      if (err) {
        next(err);
      }
      statements += 1;
      if (statements === 6) {
        // console.log('>>>>> statements: ', statements);
        next();
      }
    }

    // add debt for participant
    if (context.args.data.debt) {
      let debt = parseFloat(context.args.data.debt);
      if (!isNaN(debt) && debt > 0) {
        let query = 'insert into debts (\n' +
          'uuid, \n' +
          'relations_id, \n' +
          'debtDate, \n' +
          'debt_lc, \n' +
          'creationDate, \n' +
          'createdBy, \n' +
          'modificationDate, \n' +
          'modifiedBy) values (\n' +
          '\'' + uuidv4() + '\',\n' +
          '\'' + user.id + '\',\n' +
          '\'' + date + '\',\n' +
          '\'' + debt + '\',\n' +
          '\'' + date + '\',\n' +
          '\'' + modifier + '\',\n' +
          '\'' + date + '\',\n' +
          '\'' + modifier + '\'\n' +
          ');';
        let params = [1];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log('>>>>> query: ', query);
            console.log(err);
            doNext(err);
          } else {
            // console.log('>>>>> query:', query);
            // console.log('>>>>> commit:', data);
            context.result = data;
            doNext();
          }
        });
      }
    }

    // create role. default role is participant
    if (context.args.data.rolesId) {
      let query = 'insert into relations_with_roles (\n' +
        'relations_id, \n' +
        'roles_id,\n' +
        'creationDate, \n' +
        'createdBy, \n' +
        'modificationDate, \n' +
        'modifiedBy) values (\n' +
        '\'' + user.id + '\',\n' +
        '\'' + context.args.data.rolesId + '\',\n' +
        '\'' + date + '\',\n' +
        '\'' + modifier + '\',\n' +
        '\'' + date + '\',\n' +
        '\'' + modifier + '\'\n' +
        ');';
      let params = [1];
      ds.connector.execute(query, [], function(err, data) {
        if (err) {
          console.log('>>>>> query: ', query);
          console.log(err);
          doNext(err);
        } else {
          // console.log('>>>>> query:', query);
          // console.log('>>>>> commit:', data);
          context.result = data;
          doNext();
        }
      });
    }

    // create team if teamsId is set
    if (context.args.data.teamsId) {
      let query = 'insert into relations_with_teams (\n' +
        'relations_id, \n' +
        'teams_id,\n' +
        'creationDate, \n' +
        'createdBy, \n' +
        'modificationDate, \n' +
        'modifiedBy) values (\n' +
        '\'' + user.id + '\',\n' +
        '\'' + context.args.data.teamsId + '\',\n' +
        '\'' + date + '\',\n' +
        '\'' + modifier + '\',\n' +
        '\'' + date + '\',\n' +
        '\'' + modifier + '\'\n' +
        ');';
      let params = [1];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log('>>>>> query: ', query);
          console.log(err);
          doNext(err);
        } else {
          context.result = data;
          // console.log('>>>>> query:', query);
          // console.log('>>>>> commit:', data);
          doNext();
        }
      });
    }

    function updateRelation(locationsId) {
      let query = 'update relations set locations_id = ' +
        locationsId + ', modifiedBy=\'tester\' where id = ' + user.id;
      let params = [];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log('>>>>> query: ', query);
          console.log(err);
          doNext(err);
        } else {
          // console.log('>>>>> query:', query);
          // console.log('>>>>> data:', data);
          context.result = data;
          doNext();
        }
      });
    }

    function setDefaultValues(key) {
      let value = '';
      if (context.args.data.location &&
        context.args.data.location[key] !== undefined &&
        context.args.data.location[key] !== null) {
        value = context.args.data.location[key];
      }
      return value;
    }
    // create locations record
    let streetname = setDefaultValues('streetname');
    let housenumber = setDefaultValues('housenumber');
    let postalcode = setDefaultValues('postalcode');
    let city = setDefaultValues('city');

    let query = 'insert into locations (\n' +
      'uuid, \n' +
      'streetname, \n' +
      'housenumber, \n' +
      'postalcode, \n' +
      'city, \n' +
      'description, \n' +
      'creationDate, \n' +
      'createdBy, \n' +
      'modificationDate, \n' +
      'modifiedBy) values (\n' +
      '\'' + uuidv4() + '\',\n' +
      '\'' + streetname + '\',\n' +
      '\'' + housenumber + '\',\n' +
      '\'' + postalcode + '\',\n' +
      '\'' + city + '\',\n' +
      '\'created with relation\',\n' +
      '\'' + date + '\',\n' +
      '\'' + modifier + '\',\n' +
      'now(),\n' +
      '\'' + modifier + '\'\n' +
      ');';
    let params = [1];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log('>>>>> query: ', query);
        console.log(err);
        doNext(err);
      } else {
        context.result = data;
        let locationsId = data.insertId;
        // console.log('>>>>> query:', query);
        // console.log('>>>>> data:', data);

        // create relations record
        updateRelation(data.insertId);
        doNext();
      }
    });

    let options = {
      type: 'email',
      to: user.email,
      from: senderAddress,
      subject: 'Thanks for registering.',
      template: path.resolve(__dirname, '../../server/views/verify.ejs'),
      redirect: '/verified',
      user: user,
    };

    user.verify(options, function(err, response) {
      if (err) {
        Relations.deleteById(user.id);
        return next(err);
      }
      context.res.render('response', {
        title: 'Signed up successfully',
        content: 'Please check your email and click on the verification link ' +
          'before logging in.',
        redirectTo: '/',
        redirectToLinkText: 'Log in',
      });
      doNext();
    });
  });

// Method to render
  Relations.afterRemote('prototype.verify', function(context, user, next) {
    context.res.render('response', {
      title: 'A Link to reverify your identity has been sent ' +
        'to your email successfully',
      content: 'Please check your email and click on the verification link ' +
        'before logging in',
      redirectTo: '/',
      redirectToLinkText: 'Log in',
    });
  });

// render UI page after password change
  Relations.afterRemote('changePassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password changed successfully',
      content: 'Please login again with new password',
      redirectTo: '/',
      redirectToLinkText: 'Log in',
    });
  });

// render UI page after password reset
  Relations.afterRemote('setPassword', function(context, user, next) {
    context.res.render('response', {
      title: 'Password reset success',
      content: 'Your password has been reset successfully',
      redirectTo: '/',
      redirectToLinkText: 'Log in',
    });
  });

  Relations.afterRemote('findById', function(context, user, next) {
    console.log('>>>>>', context.args.id);

    console.log('>>>>> afterRemote', context.method.name);
    console.log('>>>>> afterRemote', context.args.data);
    console.log('>>>>> afterRemote', context.args.filter);

    function getTeams() {
      if (context.args.filter && context.args.filter.teams) {
        let query = 'select *\n' +
          'from teams t\n' +
          'where t.id in (select teams_id from relations_with_teams ' +
          'where relations_id=' + context.args.id + ')';
        console.log('>>>>> query: ', query);
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log('>>>>> query: ', query);
            console.log(err);
          } else {
            context.result.teams = data;
            getRoles();
          }
        });
      } else {
        getRoles();
      }
    }

    function getRoles() {
      if (context.args.filter && context.args.filter.roles) {
        let query = 'select roles.* from \n' +
          'relations r\n' +
          'left join relations_with_roles rwr on r.id=rwr.relations_id\n' +
          'left join roles on roles.id=rwr.roles_id\n' +
          'where r.id=' + context.args.id;
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log('>>>>> query: ', query);
            console.log(err);
          } else {
            context.result.roles = data;
            getTasks();
          }
        });
      } else {
        getTasks();
      }
    }
    function getTasks() {
      if (context.args.filter && context.args.filter.tasks) {
        let query = 'select tasks.* from \n' +
          'relations r\n' +
          'left join relations_with_tasks rwr on r.id=rwr.relations_id\n' +
          'left join tasks on tasks.id=rwr.tasks_id\n' +
          'where r.id=' + context.args.id;
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log('>>>>> query: ', query);
            console.log(err);
          } else {
            context.result.tasks = data;
            next();
          }
        });
      } else {
        console.log('>>>>> context.result: ', context.result);
        next();
      }
    }
     getTeams();
  });

// Disabled remote methods
  let methods = [
    'confirm',
    'count',
    // 'create',
    'createChangeStream',
    // 'deleteById',
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
    // Relations.disableRemoteMethodByName(methods[i]);
  }
}
;
