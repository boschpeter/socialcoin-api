'use strict';

const should = require('should');
const supertest = require('supertest');
const uuidv4 = require('uuid/v4');
const server = require('../server/server');
let config = require('../server/config');
let localConfig = require('./config.json');
let ds = server.dataSources.socialcoinDb;

describe('API Routing for CRUD operations on Tasks', function() {
  const request = supertest(localConfig.scheme + '://' +
    config.host + ':' +
    config.port +
    config.restApiRoot);
  let uuid = uuidv4();
  let taskId = 0;
  let token = null;
  let verificationToken = '';
  let relationsId = 0;
  let locationsId = 0;
  let username = 'tasks.test.js.' + uuid;
  let email = username + '@example.com';
  let body = {};

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
          'description': 'Created in test for Tasks',
          'username': username,
          'email': email,
          'debt': '999',
          'teamsId': config.testTeamId,
          'rolesId': config.testRoleId,
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
            console.log('>>>>> res', res.body);
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
  })
  ;

  // Tear down
  after(function(done) {
    this.enableTimeouts(false);
    let query = 'delete from tasks_with_status where tasks_id = ' + taskId;

    let params = [];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        query = 'delete from tasks where id=' + taskId;
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          }
          query = 'delete from relations where email = \'' + email + '\'';
           let params = [];
          ds.connector.execute(query, params, function(err, data) {
            if (err) {
              console.log(err);
            } else {
              query = 'delete from relations_with_tasks where ' +
                'tasks_id=' + taskId;
              let params = [];
              ds.connector.execute(query, params, function(err, data) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('>>>>> Tear down completed.');
                }
                done();
              });
            }
          });
        });
      }
    });
  });

  describe.skip('UN-Authenticaed access for Tasks', function() {
    it('Should NOT GET /Tasks', function(done) {
      request
        .get('/Tasks')
        .expect(401)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.statusCode.should.be.exactly(401);
          done();
        });
    });

    it('Should NOT DELETE /Tasks', function(done) {
      request
        .get('/Tasks/' + taskId)
        .expect(401)                                                  // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')    // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          // console.log('>>>>>', res.text);

          res.statusCode.should.be.exactly(401);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });
  });

  describe('AUTHENTICATED access for Tasks', function() {
    it('Should have created a USER for this test session', function(done) {
      request
        .get('/Relations/' + relationsId + '?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });
    it('Should CREATE /Tasks', function(done) {
      body = {
        'relationsId': relationsId,
        'name': 'Test - ' + uuid,
        'description': 'string',
        'valueSc': 0,
        'locationdescription': 'string',
        'startdate': '2018-08-11T10:33:57.565Z',
        'enddate': '2018-08-11T10:33:57.565Z',
        'location': {
          'streetname': 'string',
          'housenumber': 'string',
          'city': 'string',
          'housenumber_suffix': 'string',
          'postalcode': 'string',
          'description': 'string',
          'latitude': 'string',
          'longitude': 'string',
          'json': {},
        },
      };
      request
        .post('/Tasks?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .send(body)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          let json = JSON.parse(res.text);
          taskId = json.id;
          locationsId = json.location.id;
          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });
    it('Should PATCH /Tasks (minimal updates)', function(done) {
      let body = {};
      request
        .patch('/Tasks/' + taskId + '?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .send(body)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });
    it('Should GET /Tasks/{id} (verify minimal update)', function(done) {
      let statusCode = 200;
      request
        .get('/Tasks/' + taskId + '?access_token=' + token)
        .expect(statusCode)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.statusCode.should.be.exactly(statusCode);
          let json = JSON.parse(res.text);
          let taskObj = json[0];
          json.length.should.be.exactly(1);
          let keys = [
            {name: 'taskId', value: '', type: 'number'},
            {name: 'taskUuid', value: '', type: 'string'},
            {name: 'taskName', value: '', type: 'string'},
            {name: 'taskDescription', value: '', type: 'string'},
            {name: 'taskValueSc', value: '', type: 'number'},
            {name: 'taskPhonenumber', value: '', type: 'string'},
            {name: 'taskEmail', value: '', type: 'string'},
            {name: 'taskStartDate', value: '', type: 'string'},
            {name: 'taskEndDate', value: '', type: 'string'},
            {name: 'taskEffort', value: '', type: 'number'},
            {name: 'taskCreationDate', value: '', type: 'string'},
            {name: 'taskCreatedBy', value: null, type: ''},
            {name: 'taskModificationDate', value: '', type: 'string'},
            {name: 'taskModifiedBy', value: '', type: 'string'},
            {name: 'taskLocationDescription', value: '', type: 'string'},
            {name: 'taskLocationId', value: '', type: 'number'},
            {name: 'statusId', value: '', type: 'number'},
            {name: 'locationStreetname', value: '', type: 'string'},
            {name: 'locationHousenumber', value: '', type: 'string'},
            {name: 'locationHousenumberSuffix', value: '', type: 'string'},
            {name: 'taskLocationPostalcode', value: '', type: 'string'},
            {name: 'taskLocationCity', value: '', type: 'string'},
            {name: 'taskLocationLatitude', value: '', type: 'string'},
            {name: 'taskLocationLongitude', value: '', type: 'string'},
            {name: 'taskLocationDescription', value: '', type: 'string'},
            {name: 'taskLocationJson', value: '', type: 'string'},
            {name: 'statusId', value: '', type: 'number'},
            {name: 'statusUuid', value: '', type: 'string'},
            {name: 'statusName', value: '', type: 'string'},
            {name: 'statusDescription', value: null, type: 'string'},
            {name: 'statusJson', value: null, type: 'string'},
            {name: 'relations', value: '', type: 'object'},
            {name: 'actions', value: '', type: 'object'},
          ];
          for (let i = 0; i < keys.length; i++) {
            let keyName = keys[i].name;
            // Test for keys
            taskObj.should.have.key(keyName);
            // Test for null values
            if (keys[i].value === null) {
              if (taskObj[keyName] !== null) {
                let err = new Error(keyName + ' should be null.');
                console.log(err);
              }
              should.not.exist(taskObj[keyName]);
            } else {
              if (taskObj[keyName] === null) {
                let err = new Error(keyName + ' should not be null.');
                console.log(err);
              }
              should.exist(taskObj[keyName]);
            }
            // Test for types
            if (keys[i].type !== '' && taskObj[keyName] !== null) {
              let obj = taskObj[keyName];
              let type = keys[i].type;
              if (!(typeof obj === type)) {
                let err = new Error(keyName + ' should be of type ' +
                  keys[i].type) + '. It is ' + (taskObj[keyName].constructor);
                console.log(err);
              }
              taskObj[keyName].should.be.type(keys[i].type);
            }
          }
          done();
        });
    });
    it('Should PATCH /Tasks (full updates)', function(done) {
      let body = {
        'uuid': 'b0eb00b8-2aea-4790-b34c-55f9c509131d',
        'name': 'Updated Daycare (TESTING)',
        'description': 'Updated Lorem ipsum',
        'valueSc': 40,
        'phonenumber': 'Updated 0123456789',
        'email': 'task.owner-updated@test-team.com',
        'startDate': null,
        'endDate': null,
        'effort': 0,
        'relation': {
          'id': relationsId,
          'uuid': '1',
          'firstname': 'updated John',
          'prefix': 'updated ',
          'lastname': 'updated Doe',
          'dateOfBirth': '1964-11-02',
          'phonenumber': 'updated 06-28617829',
          'email': email,
          'description': 'updated',
          'json': {'a': 'updated '},
        },
        'location': {
          'id': locationsId,
          'description': 'updated participant',
          'streetname': 'Updated Valkstraat',
          'housenumber': 'Updated 6',
          'housenumberSuffix': null,
          'postalcode': 'Updated 6611KW',
          'city': 'Updated Overasselt',
          'latitude': null,
          'longitude': null,
          'json': {'a': 'updated '},
        },
        'role': {
          'roleId': 12,
          'roleUuid': '716a38bd-96fe-11e8-99ba-8e9c42f3e967',
          'roleName': 'Participant',
        },
        'status': {
          'id': 33,
          'uuid': 'bd612f02-96fe-11e8-99ba-8e9c42f3e967',
          'statusName': 'Pending for approval',
          'description': null,
          'json': {'a': 1},
        },
      };
      let statusCode = 200;
      request
        .patch('/Tasks/' + taskId + '?access_token=' + token)
        // .set('Accept', 'application/json;')
        // .set('Content-Type', 'application/json;')
        // .set('Accept-Encoding', 'gzip, deflate, br;')
        // .set('Content-length', JSON.stringify(body).length)
        // .set('Content-Type', 'application/x-www-form-urlencoded')
        .send(body)
        .expect(statusCode)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .end(function(err, res) {
          // console.log('??????', res.text)
          if (err) {
            throw err;
          }
          res.statusCode.should.be.exactly(statusCode);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');
          let json = JSON.parse(res.text);
          done();
        });
    });
    it('Should GET /Tasks/{id} (verify full update)', function(done) {
      let statusCode = 200;
      request
        .get('/Tasks/' + taskId + '?access_token=' + token)
        .expect(statusCode)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.statusCode.should.be.exactly(statusCode);
          let json = JSON.parse(res.text);
          let taskObj = json[0];
          json.length.should.be.exactly(1);
          let keys = [{name: 'taskName', value: '', type: 'string'},
            {name: 'taskId', value: '', type: 'number'},
            {name: 'taskUuid', value: '', type: 'string'},
            {name: 'taskName', value: '', type: 'string'},
            {name: 'taskDescription', value: '', type: 'string'},
            {name: 'taskValueSc', value: '', type: 'number'},
            {name: 'taskPhonenumber', value: '', type: 'string'},
            {name: 'taskEmail', value: '', type: 'string'},
            {name: 'taskStartDate', value: '', type: 'string'},
            {name: 'taskEndDate', value: '', type: 'string'},
            {name: 'taskEffort', value: '', type: 'number'},
            {name: 'taskCreationDate', value: '', type: 'string'},
            {name: 'taskCreatedBy', value: null, type: ''},
            {name: 'taskModificationDate', value: '', type: 'string'},
            {name: 'taskModifiedBy', value: '', type: 'string'},
            {name: 'taskLocationDescription', value: '', type: 'string'},
            {name: 'taskLocationId', value: '', type: 'number'},
            {name: 'statusId', value: '', type: 'number'},
            {name: 'locationStreetname', value: '', type: 'string'},
            {name: 'locationHousenumber', value: '', type: 'string'},
            {name: 'locationHousenumberSuffix', value: '', type: 'string'},
            {name: 'taskLocationPostalcode', value: '', type: 'string'},
            {name: 'taskLocationCity', value: '', type: 'string'},
            {name: 'taskLocationLatitude', value: '', type: 'string'},
            {name: 'taskLocationLongitude', value: '', type: 'string'},
            {name: 'taskLocationDescription', value: '', type: 'string'},
            {name: 'taskLocationJson', value: '', type: 'string'},
            {name: 'statusId', value: '', type: 'number'},
            {name: 'statusUuid', value: '', type: 'string'},
            {name: 'statusName', value: '', type: 'string'},
            {name: 'statusDescription', value: null, type: 'string'},
            {name: 'statusJson', value: null, type: 'string'},
            {name: 'relations', value: '', type: 'object'},
            {name: 'actions', value: '', type: 'object'},
          ];
          for (let i = 0; i < keys.length; i++) {
            let keyName = keys[i].name;
            // Test for keys
            taskObj.should.have.key(keyName);
            // Test for null values
            if (keys[i].value === null) {
              if (taskObj[keyName] !== null) {
                let err = new Error(keyName + ' should be null.');
                console.log(err);
              }
              should.not.exist(taskObj[keyName]);
            } else {
              if (taskObj[keyName] === null) {
                let err = new Error(keyName + ' should not be null.');
                console.log(err);
              }
              should.exist(taskObj[keyName]);
            }
            // Test for types
            if (keys[i].type !== '' && taskObj[keyName] !== null) {
              let obj = taskObj[keyName];
              let type = keys[i].type;
              if (!(typeof obj === type)) {
                let err = new Error(keyName + ' should be of type ' +
                  keys[i].type) + '. It is ' + (taskObj[keyName].constructor);
                console.log(err);
              }
              taskObj[keyName].should.be.type(keys[i].type);
            }
          }
          done();
        });
    });
    let fields = ['taskId', 'taskUuid', 'taskName', 'taskDescription',
      'taskValueSc', 'taskPhonenumber', 'taskEmail', 'taskStartDate',
      'taskEndDate', 'taskEffort', 'taskCreationDate', 'taskCreatedBy',
      'taskModificationDate', 'taskModifiedBy',
      'taskLocationId', 'locationStreetname', 'locationHousenumber',
      'locationHousenumberSuffix', 'taskLocationPostalcode',
      'taskLocationCity', 'taskLocationLatitude', 'taskLocationLongitude',
      'taskLocationDescription', 'taskLocationJson',
      'statusId', 'statusUuid', 'statusName',
    ];
    it('Should GET /Tasks', function(done) {
      let statusCode = 200;
      request
        .get('/Tasks?access_token=' + token)
        .expect(statusCode)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          let json = JSON.parse(res.text);
          let obj = {};
          if (json.length > 0) {
            obj = json[0];
          }
          let presentFieldCounter = 0;
          for (let i = 0; i < fields.length; i++) {
            if (obj[fields[i]] !== undefined) {
              presentFieldCounter++;
            }
          }
          if (presentFieldCounter !== fields.length) {
            let err = new Error('There should be ' + fields.length +
              ' fields.' +
              'The actual number of fields is ' + presentFieldCounter + '.');
            console.log(err);
          }
          presentFieldCounter.should.be.exactly(fields.length);
          res.statusCode.should.be.exactly(statusCode);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });

    it('Should GET /Tasks with filter applied', function(done) {
      let filter = {'where': {'and': [{'roleId': 12}, {'taskId': 65}]}};
      let filterEncoded = encodeURI(filter);
      let statusCode = 200;
      request
        .get('/Tasks?' + filterEncoded + '&access_token=' + token)
        .expect(statusCode)                                              // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          let json = JSON.parse(res.text);
          console.log(json);
          let obj = {};
          if (json.length > 0) {
            obj = json[0];
          }
          let presentFieldCounter = 0;
          for (let i = 0; i < fields.length; i++) {
            if (obj[fields[i]] !== undefined) {
              presentFieldCounter++;
            }
          }
          if (presentFieldCounter !== fields.length) {
            let err = new Error('There should be ' + fields.length +
              ' fields.' +
              'The actual number of fields is ' + presentFieldCounter + '.');
            console.log(err);
          }
          presentFieldCounter.should.be.exactly(fields.length);
          json.length.should.be.above(0);
          res.statusCode.should.be.exactly(statusCode);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });

    it('Should NOT DELETE /Tasks', function(done) {
      request
        .delete('/Tasks/' + taskId + '?access_token=' + token)
        .expect(404)                                                  // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')    // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          // console.log('>>>>>', res.text);

          res.statusCode.should.be.exactly(404);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });
  });
});
