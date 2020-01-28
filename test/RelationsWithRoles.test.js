'use strict';

const should = require('should');
const supertest = require('supertest');
const uuidv4 = require('uuid/v4');
const server = require('../server/server');
let config = require('../server/config');
let localConfig = require('./config.json');
let ds = server.dataSources.socialcoinDb;

describe('API Routing for CRUD operations on RelationsWithRoles',
  function() {
    let token = null;
    let rolesId = 0;
    let uuid = uuidv4();
    let email = 'john.doe.' + uuid + '@example.com';
    let relationsId = 0;
    let verificationToken = '';
    let relationEmail = 'theo.theunissen+' + uuid + '@gmail.com';

    const request = supertest(localConfig.scheme + '://' +
      config.host + ':' +
      config.port +
      config.restApiRoot);

    // Set up
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
          // createUser(done);

          let body = {
            'firstname': 'John',
            'prefix': '',
            'lastname': 'Doe',
            'dateOfBirth': '1970-01-01',
            'phonenumber': '06-12345678',
            'description': 'Created in test for RelationsWithRoles',
            'username': 'johndoe',
            'email': relationEmail,
            'debt': '999',
            'rolesId': '10',
            'teamsId': 1,
            'location': {
              'streetname': 'My Streetnamess',
              'housenumber': '123',
              'postalcode': '1234AB',
              'city': 'MyCity',
            },
          };
          body.firstname = 'Test - ' + uuid;
          body.username = 'Test - ' + uuid;

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
                'from relations where email = \'' + relationEmail + '\'';
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

    // Tear down
    after(function(done) {
      this.enableTimeouts(false);
      let query = 'delete from roles where id = ' + rolesId;
      let params = [];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          let query = 'delete from relations where email=\'' + email +
            '\'';
          let params = [];
          ds.connector.execute(query, params, function(err, data) {
            if (err) {
              console.log(err);
            } else {
              let query = 'delete from relations where id = ' + relationsId;
              let params = [];
              ds.connector.execute(query, params, function(err, data) {
                if (err) {
                  console.log(err);
                } else {
                  let query = 'delete from relations where email=\'' +
                    email + '\'';
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
            }
          });
        }
      });
    });

    describe.skip('UN-Authenticaed access for ROLES', function() {
      it('Should NOT GET /RelationsWithRoles', function(done) {
        request
          .get('/RelationsWithRoles')
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

      it('Should NOT DELETE /RelationsWithRoles', function(done) {
        request
          .get('/RelationsWithRoles/' + rolesId)
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

    // describe.skip('Create a user that is will be used in RelationsWithRoles',
    //   function() {
    //     let relation = {
    //       'firstname': 'John',
    //       'prefix': '',
    //       'lastname': 'Doe',
    //       'dateOfBirth': '1970-01-01',
    //       'phonenumber': '06-12345678',
    //       'description': 'Master of socialcoin',
    //       'username': 'johndoe',
    //       'email': relationEmail,
    //       'debt': '999',
    //       'rolesId': '10',
    //       'teamsId': 1,
    //       'location': {
    //         'streetname': 'My Streetnamess',
    //         'housenumber': '123',
    //         'postalcode': '1234AB',
    //         'city': 'MyCity',
    //       },
    //     };
    //     relation.firstname = 'Test - ' + uuid;
    //     relation.username = 'Test - ' + uuid;
    //
    //     it('Should CREATE /Relations', function(done) {
    //       request
    //         .post('/Relations?access_token=' + token)
    //         .send(relation)
    //         .expect(200)                                                // supertest
    //         .expect('Content-Type', 'text/html; charset=utf-8')         // supertest
    //         .end(function(err, res) {
    //           if (err) {
    //             throw err;
    //           }
    //
    //           console.log('>>>>> res.text: ', res.text);
    //           res.statusCode.should.be.exactly(200);
    //           res.type.should.be.exactly('text/html');
    //           res.charset.should.be.exactly('utf-8');
    //
    //           let query = 'select * ' +
    //             'from relations where email = \'' + relationEmail + '\'';
    //           let params = [];
    //           ds.connector.execute(query, params, function(err, data) {
    //             if (err) {
    //               console.log(err);
    //               done(err);
    //             } else {
    //               verificationToken = data[0].verificationToken;
    //               relationsId = data[0].id;
    //               console.log('>>>>> data', data);
    //               console.log('>>>>> verificationToken', verificationToken);
    //               console.log('>>>>> relationsId', relationsId);
    //               console.log('>>>>> token', token);
    //               done();
    //             }
    //           });
    //         });
    //     });
    //   });

    describe('AUTHENTICATED access for ROLES', function() {
      it('Should have created a USER for this test session', function(done) {
        request
          .get('/Relations/' + relationsId + '?access_token=' + token)
          .expect(200)                                                // supertest
          .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
          .send(role)
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            rolesId = JSON.parse(res.text).id;
            res.statusCode.should.be.exactly(200);
            res.type.should.be.exactly('application/json');
            res.charset.should.be.exactly('utf-8');

            done();
          });
      });

      let role = {
        'name': 'Test - ' + uuid,
      };

      it('Should CREATE /Roles', function(done) {
        request
          .post('/Roles?access_token=' + token)
          .expect(200)                                                // supertest
          .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
          .send(role)
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            rolesId = JSON.parse(res.text).id;
            res.statusCode.should.be.exactly(200);
            res.type.should.be.exactly('application/json');
            res.charset.should.be.exactly('utf-8');

            done();
          });
      });

      it('Should CREATE /RelationsWithRoles', function(done) {
        let body = {
          'rolesId': rolesId,
          'relationsId': relationsId,
        };
        request
          .post('/RelationsWithRoles?access_token=' + token)
          .expect(200)                                                // supertest
          .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
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

      it('Should GET /RelationsWithRoles', function(done) {
        let filter = encodeURIComponent('{"rolesId": ' + rolesId + '}');
        request
          .get('/RelationsWithRoles?filter=' + filter +
            '&access_token=' + token)
          .expect(200)                                                // supertest
          .expect('Content-Type', 'application/json; charset=utf-8')                 // supertest
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            let text = res.text;
            let json = JSON.parse(text);
            json.length.should.be.above(0);
            res.statusCode.should.be.exactly(200);
            res.type.should.be.exactly('application/json');
            res.charset.should.be.exactly('utf-8');

            done();
          });
      });

      xit('Should UPDATE /RelationsWithRoles, incuding relation and location',
        function(done) {
          let role = {
            'id': rolesId,
            'uuid': uuid,
            'name': 'Test - ' + uuid,
            'description': 'string',
            'json': {
              'teamjson': 'someValue',
            },
            'creationdate': '2018-08-25T17:03:37.000Z',
            'createdby': 'string',
            'modificationdate': '2018-08-25T17:03:37.000Z',
            'modifiedby': 'string',
            'relation': [
              {
                'id': 52,
                'uuid': 'b23a0a39-48f3-4715-b595-e39ee2ba486c',
                'firstname': 'Theo',
                'prefix': null,
                'lastname': 'Theunissen',
                'relationsName': null,
                'phonenumber': '628617829',
                'email': 'theo.theunissen@gmail.com',
                'description': null,
                'json': {'a': '1'},
                'creationDate': '2018-08-07T15:01:23.000Z',
                'createdBy': '127.0.0.1',
                'modificationDate': '2018-08-07T15:01:23.000Z',
                'modifiedBy': '127.0.0.1',
                'locationsId': 1,
                'streetname': 'Valkstraat',
                'housenumber': '6',
                'housenumber_suffix': null,
                'postalcode': '6611KW',
                'city': 'Overasselt',
              },
            ],
          };

          request
            .put('/RelationsWithRoles/' + rolesId + '?access_token=' + token)
            .send(role)
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

      it('Should DELETE /RelationsWithRoles', function(done) {
        let body = {
          'relationsId': relationsId,
          'rolesId': rolesId,
        };
        let expectedStatusCode = 200;

        request
          .delete('/RelationsWithRoles?access_token=' + token)
          .send(body)
          .expect(expectedStatusCode)                                                  // supertest
          .expect('Content-Type', 'application/json; charset=utf-8')    // supertest
          .end(function(err, res) {
            if (err) {
              throw err;
            }
            // console.log('>>>>>', res.text);

            res.statusCode.should.be.exactly(expectedStatusCode);
            res.type.should.be.exactly('application/json');
            res.charset.should.be.exactly('utf-8');

            done();
          });
      });
    });
  });
