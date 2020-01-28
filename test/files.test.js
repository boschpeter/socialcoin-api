'use strict';

const should = require('should');
const supertest = require('supertest');
const uuidv4 = require('uuid/v4');
const server = require('../server/server');
let config = require('../server/config');
let localConfig = require('./config.json');
let ds = server.dataSources.socialcoinDb;
let fs = require('fs');

describe('Testing Loopback Storage component', function() {
  let uuid = uuidv4();
  let token = '';
  let verificationToken = '';
  let relationsId = 0;
  let sourcePath = './data/';
  let destinationPath = './storage/';
  let filename = 'test-pattern.png';
  let newPath = '';
  let newFilename = '';
  let fileId = 0;
  let actionId = 0;
  let taskId = 1;

  const request = supertest(localConfig.scheme + '://' +
    config.host + ':' +
    config.port +
    config.restApiRoot);
  let email = 'theo.theunissen+' + uuid + '@gmail.com';

  before(function(done) {
    this.enableTimeouts(false);
    request
      .post('/Relations/login')
      .send(localConfig.credentials)
      .end(function(err, response) {
        if (err) {
          console.log(err);
          done(err);
        }
        let json = JSON.parse(response.text);
        let id = json.id;
        token = id;

        let body = {
          'firstname': 'John',
          'prefix': '',
          'lastname': 'Doe',
          'dateOfBirth': '1970-01-01',
          'phonenumber': '06-12345678',
          'description': 'Created in test for File uploads',
          'username': 'johndoe',
          'email': email,
          'debt': '999',
          'teamsId': 1,
          'rolesId': 9,
          'location': {
            'streetname': 'My Streetnames',
            'housenumber': '123',
            'postalcode': '1234AB',
            'city': 'MyCity',
          },
        };
        body.firstname = 'TasksTest-' + uuid;
        body.username = email;

        request
          .post('/Relations?access_token=' + token)
          .send(body)
          .expect(200)                                                // supertest
          .expect('Content-Type', 'text/html; charset=utf-8')         // supertest
          .end(function(err, res) {
            if (err) {
              throw err;
            }

            res.statusCode.should.be.exactly(200);
            res.type.should.be.exactly('text/html');
            res.charset.should.be.exactly('utf-8');

            let query = 'select * ' +
              'from relations where email = \'' + email + '\'';
            let params = [];
            ds.connector.execute(query, params, function(err, data) {
              if (err) {
                console.log('>>>>> err', err);
                done(err);
              } else {
                verificationToken = data[0].verificationToken;
                relationsId = data[0].id;
                done();
              }
            });
          });
      });
  });

  // Tear down
  after(function(done) {
    this.enableTimeouts(false);
    let query = 'delete from files where ' +
      'id=' + fileId;
    let params = [];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        let query = 'delete from tasks_with_actions where ' +
          'tasks_id=' + taskId + '\n' +
          'and actions_id=' + actionId;
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            let query = 'delete from actions where ' +
              'id=' + actionId;
            let params = [];
            ds.connector.execute(query, params, function(err, data) {
              if (err) {
                console.log(err);
              } else {
                fs.unlink(destinationPath + newPath + '/' + newFilename,
                  function() {
                    done();
                  });
              }
            });
          }
        });
      }
    });
  });

  describe('Uploading...', function() {
    it('Should upload file', function(done) {
      let boundary = Math.random();
      let statusCode = 200;
      let url = '/files/upload?access_token=' + token;
      request
        .post(url)
        .field('taskId', taskId)
        .field('effort', 0)
        .field('json', JSON.stringify({test: 123}))
        .field('description', 'Lorem ipsum')
        .attach('file', sourcePath + filename)
        .expect(statusCode)                                         // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
        .end(function(err, res) {
          let json = JSON.parse(res.text);
          // console.log('>>>>> json', json);
          newPath = json.newPath;
          newFilename = json.newFilename;
          fileId = json.id;
          actionId = json.actionId;
          if (err) {
            throw err;
          }
          let fileExist = fs.existsSync(sourcePath + filename);
          res.statusCode.should.be.exactly(statusCode);
          should(fileExist).be.exactly(true);
          done();
        });
    });
  });
});
