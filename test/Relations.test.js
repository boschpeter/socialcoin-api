'use strict';

const should = require('should');
const supertest = require('supertest');
const uuidv4 = require('uuid/v4');
const server = require('../server/server');
let config = require('../server/config');
let localConfig = require('./config.json');
let ds = server.dataSources.socialcoinDb;

describe('API Routing for CRUD operations on Relations', function() {
  let relationId = 0;
  let uuid = uuidv4();
  let token = '';
  let verificationToken = '';

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
        if (err || !response) {
          done(err);
        } else {
          let json = JSON.parse(response.text);
          let id = json.id;
          token = id;
          console.log('>>>>> Set up for Relations completed.');
          done();
        }
      });
  });

  // Tear down
  after(function(done) {
    this.enableTimeouts(false);

    let query = 'delete from relations where email = \'' + email + '\'';
    let params = [1];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('>>>>> Tear down completed.');
      }
      done();
    });
  });
  describe.skip('UN-Authenticaed access for Relations', function() {
    it('Should NOT GET /Relations', function(done) {
      request
        .get('/Relations')
        .expect(401)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          res.statusCode.should.be.exactly(401);
          done();
        });
    });

    it('Should NOT DELETE /Relations', function(done) {
      request
        .get('/Relations/' + email)
        .expect(401)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
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

  describe('AUTHENTICATED access for Relations', function() {
    let body = {
      'firstname': 'John',
      'prefix': '',
      'lastname': 'Doe',
      'dateOfBirth': '1970-01-01',
      'phonenumber': '06-12345678',
      'description': 'Master of socialcoin',
      'username': 'johndoe',
      'email': email,
      'debt': '999',
      'rolesId': config.testRoleId,
      'teamsId': config.teamId,
      'location': {
        'streetname': 'My Streetnamess',
        'housenumber': '123',
        'postalcode': '1234AB',
        'city': 'MyCity',
      },
    };
    body.firstname = 'Test - ' + uuid;
    body.username = 'Test - ' + uuid;

    it('Should CREATE /Relations', function(done) {
      this.enableTimeouts(false);
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
              console.log(err);
              done(err);
            } else {
              verificationToken = data[0].verificationToken;
              relationId = data[0].id;
              // console.log('>>>>> data', data);
              // console.log('>>>>> verificationToken', verificationToken);
              // console.log('>>>>> relationId', relationId);
              // console.log('>>>>> token', token);
              done();
            }
          });
        });
    });

    it('Should validate registration of /Relations', function(done) {
      let url = '/Relations/confirm?uid=' + relationId +
        '&redirect=%2Fverified&token=' + verificationToken;
      request
        .get(url)
        .expect(302)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
          done();
        });
    });

    it('Should GET /Relations', function(done) {
      request
        .get('/Relations?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
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

    it('Should GET /Relations/{id}', function(done) {
      let url = '/Relations/' + relationId + '?access_token=' + token;
      request
        .get('/Relations/' + relationId + '/?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
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

    it('Should GET /Relations/{id} with roles', function(done) {
      let url = '/Relations/' + relationId +
        '?filter=%7B%22roles%22%3Atrue%7D&access_token=' + token;
      request
        .get(url)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }
         console.log('>>>>>', res.text);

          res.statusCode.should.be.exactly(200);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });
    it('Should NOT DELETE /Relations', function(done) {
      request
        .delete('/Relations/' + relationId + '?access_token=' + token)
        .expect(200)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
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

    it('Log out from /Relations', function(done) {
      request
        .post('/Relations/logout?access_token=' + token)
        .expect(204)                                                // supertest
        .expect('Content-Type', 'application/json; charset=utf-8')  // supertest
        .end(function(err, res) {
          if (err) {
            throw err;
          }

          res.statusCode.should.be.exactly(204);
          res.type.should.be.exactly('application/json');
          res.charset.should.be.exactly('utf-8');

          done();
        });
    });
  });
});
