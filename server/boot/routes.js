// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: loopback-example-user-management
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
'use strict';

let dsConfig = require('../datasources.json');
let path = require('path');
let server = require('../server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(app) {
  let User = app.models.user;
  let Relations = app.models.Relations;

  // login page
  app.get('/', function(req, res) {
    let credentials = dsConfig.emailDs.transports[0].auth;
    res.render('login', {
      email: credentials.user,
      password: credentials.pass,
    });
  });

  // verified
  app.get('/verified', function(req, res) {
    res.render('verified');
  });

  // log a user in
  app.post('/login', function(req, res) {
    Relations.login({
      email: req.body.email,
      password: req.body.password,
    }, 'user', function(err, token) {
      if (err) {
        if (err.details && err.code === 'LOGIN_FAILED_EMAIL_NOT_VERIFIED') {
          res.render('reponseToTriggerEmail', {
            title: 'Login failed',
            content: err,
            redirectToEmail: '/api/relations/' + err.details.userId + '/verify',
            redirectTo: '/',
            redirectToLinkText: 'Click here',
            userId: err.details.userId,
          });
        } else {
          res.render('response', {
            title: 'Login failed. Wrong username or password',
            content: err,
            redirectTo: '/',
            redirectToLinkText: 'Please login again',
          });
        }
        return;
      }
      res.render('home', {
        email: req.body.email,
        accessToken: token.id,
        redirectUrl: '/api/relations/change-password?access_token=' + token.id,
      });
    });
  });

  // log a user out
  app.get('/logout', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    User.logout(req.accessToken.id, function(err) {
      if (err) return next(err);
      res.redirect('/');
    });
  });

  // send an email with instructions to reset an existing user's password
  app.post('/request-password-reset', function(req, res, next) {
    Relations.resetPassword({
      email: req.body.email,
    }, function(err) {
      if (err) return res.status(401).send(err);

      res.render('response', {
        title: 'Password reset requested',
        content: 'Check your email for further instructions',
        redirectTo: '/',
        redirectToLinkText: 'Log in',
      });
    });
  });

  // show password reset form
  app.get('/reset-password', function(req, res, next) {
    if (!req.accessToken) return res.sendStatus(401);
    res.render('password-reset', {
      redirectUrl: '/api/relations/reset-password?access_token=' +
      req.accessToken.id,
    });
  });

  // test shit
  app.get('/ping', function(req, res) {
    res.send('pongaroo');
  });

  app.get('/participantsxxxxx', function(req, res) {
    if (!req.accessToken || !req.accessToken.id) {
      res.send({
        'error': {
          'statusCode': 401,
          'name': 'Error',
          'message': 'Authorization Required',
          'code': 'AUTHORIZATION_REQUIRED',
        },
      });
    } else {
      let query = 'select r.id,\n' +
        'r.locations_id,\n' +
        'r.firstname,\n' +
        'r.prefix,\n' +
        'r.lastname,\n' +
        'r.date_of_birth,\n' +
        'r.phonenumber,\n' +
        'r.email,\n' +
        'r.description,\n' +
        'r.username,\n' +
        'r.creationDate,\n' +
        'r.createdBy,\n' +
        'r.modificationDate,\n' +
        'r.modifiedBy,\n' +
        't.id teamId,\n' +
        't.name teamName\n' +
        ', (select sum(debt_lc)  from debts where relations_id=r.id) debt\n' +
        'from (relations r, \n' +
        'relations_with_roles rwr)\n' +
        'left join relations_with_teams rwt on r.id=rwt.relations_id \n' +
        'left join teams t on t.id=rwt.teams_id\n' +
        'where r.id=rwr.relations_id\n' +
        'and rwr.roles_id=12';
      let params = [];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          res.send(data);
        }
      });
    }
  });
};
