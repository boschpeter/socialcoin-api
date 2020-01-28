'use strict';

const should = require('should');
const supertest = require('supertest');
const uuidv4 = require('uuid/v4');
const server = require('../server/server');
let config = require('../server/config');
let localConfig = require('./config.json');
let ds = server.dataSources.socialcoinDb;

describe('API Routing for CRUD operations on Teams', function() {
  let token = null;
  let verificationToken = '';
  let relationsId = 0;
  let teamId = 0;
  let taskId = 0;
  let uuid = uuidv4();
  let email = 'teams.test.js.' + uuid + '@example.com';
  let lolationsId = 0;

  const request = supertest(localConfig.scheme + '://' +
    config.host + ':' +
    config.port +
    config.restApiRoot);

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
          'description': 'Created in test for Teams',
          'username': 'johndoe',
          'email': email,
          'debt': '999',
          'teamsId': config.testTeamId,
          'location': {
            'streetname': 'My Streetnames',
            'housenumber': '123',
            'postalcode': '1234AB',
            'city': 'MyCity',
          },
        };
        body.firstname = 'TeamsTest-' + uuid;
        body.username = 'teamstest-' + uuid;

        // get first task (DO NOT DELETE THE TASK)
        let query = 'select id from tasks limit 1';
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log('>>>>> err', err);
            done(err);
          } else {
            taskId = data[0].id;
          }

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
                  // console.log('>>>>> data', data);
                  // console.log('>>>>> verificationToken', verificationToken);
                  // console.log('>>>>> relationsId', relationsId);
                  // console.log('>>>>> token', token);

                  console.log('>>>>> Set up for RelationsWithRoles completed.');
                  done();
                }
              });
            });
        });
      });
  });
// Tear down
  after(function(done) {
    let relationIds = [0];
    this.enableTimeouts(false);
    let query = 'select id from relations \n' + '' +
      'where email like \'teams.test.js%@example.com\'';
    let params = [];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        for (let i = 0; i < data.length; i = i + 1) {
          relationIds.push(data[i].id);
        }
        let query = 'delete from locations ' +
          'where id<>1 and id in (select locations_id from ' +
          'relations where id in (' + relationIds.join(', ') + '))';
        // console.log('>>>>> query:', query);
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            let query = 'delete from relations ' +
              'where id in (' + relationIds.join(', ') + ')';
            // console.log('>>>>> query:', query);
            let params = [];
            ds.connector.execute(query, params, function(err, data) {
              if (err) {
                console.log(err);
              } else {
                let query = 'delete from relations_with_teams ' +
                  'where relations_id in (' + relationIds.join(', ') + ')';
                let params = [];
                // console.log('>>>>> query:', query);
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
          }
        });
      }
    });
  });

  describe.skip('UN-Authenticaed access for TEAMS', function() {
    it('Should NOT GET /Teams', function(done) {
      request
        .get('/Teams')
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

    it('Should NOT DELETE /Teams', function(done) {
      request
        .get('/Teams/' + teamId)
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

  describe('AUTHENTICATED access for TEAMS', function() {
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

    let body = {
      'name': 'Test Team',
      'description': 'Created in Team test',
      'json': {'somevalue': 'Created in Team test'},
      'relation': {
        'firstname': 'Eusébio',
        'prefix': '',
        'lastname': 'da Silva Ferreira',
        'phonenumber': '0123456789',
        'email': email,
        'description': 'Another relation creation from Teams test',
        'json': {'somevalue': 'Created in Team test'},
      },
      'location': {
        'streetname': 'Avenida da Liberdade',
        'housenumber': '1',
        'postalcode': '000000',
        'city': 'Lisbon',
      },
    };
    body.name = 'Test - ' + uuid;

    it('Should CREATE /Teams', function(done) {
      request
        .post('/Teams?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .send(body)
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          teamId = JSON.parse(res.text).id;
          relationsId = JSON.parse(res.text).relationsId;
          relationsId.should.be.above(1);
          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });

    it('Should GET /Teams', function(done) {
      request
        .get('/Teams?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          // console.log('>>>>>', res.text);
          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });

    it('Should GET /Teams/{id}', function(done) {
      request
        .get('/Teams/ ' + teamId + '?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          let json = JSON.parse(res.text);
          json.id.should.be.exactly(teamId);
          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });

    it('Should assign task to team', function(done) {
      // Preparation. Select first task

    });

    it('Should GET /Teams/{id} with TASKS for team', function(done) {
      let filter = {'tasks': true};
      let filterEncoded = encodeURI(filter);
      request
        .get('/Teams/ ' + teamId + '?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          let json = JSON.parse(res.text);
          console.log(json);
          json.id.should.be.exactly(teamId);
          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });

    it('Should UPDATE /Teams, incuding relation and location', function(done) {
      let body = {
        'id': teamId,
        'uuid': uuid,
        'name': 'Test - ' + uuid,
        'description': 'Created in Team test',
        'json': {
          'updated': 'Team is updated.',
        },
        'creationdate': '2018-08-25T17:03:37.000Z',
        'createdby': 'string',
        'modificationdate': '2018-08-25T17:03:37.000Z',
        'modifiedby': 'string',
        'relation': [
          {
            'id': relationsId,
            'uuid': 'b23a0a39-48f3-4715-b595-e39ee2ba486c',
            'firstname': 'Updated Theo',
            'prefix': null,
            'lastname': 'Updated Theunissen',
            'relationsName': null,
            'phonenumber': 'Updated 628617829',
            'description': 'Updated Created in Team test',
            'json': {'updated': 'relation is updated in Teams test'},
            'creationDate': '2018-08-07T15:01:23.000Z',
            'createdBy': '127.0.0.1',
            'modificationDate': '2018-08-07T15:01:23.000Z',
            'modifiedBy': '127.0.0.1',
            'locationsId': config.testLocationId,
            'streetname': 'Updated Valkstraat',
            'housenumber': 'Updated 6',
            'housenumber_suffix': null,
            'postalcode': 'Updated 6611KW',
            'city': 'Updated Overasselt',
          },
        ],
      };
      request
        .put('/Teams/' + teamId + '?access_token=' + token)
        .send(body)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          // console.log('>>>>>', res.text);
          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });

    it('Should NOT DELETE /Teams', function(done) {
      let statusCode = 404;
      request
        .delete('/Teams/' + teamId + '?access_token=' + token)
        .expect(statusCode)                                                  // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')    // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.statusCode.should.be.exactly(statusCode);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });
  });
})
;
