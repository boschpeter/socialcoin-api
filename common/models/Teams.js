'use strict';
const uuidv4 = require('uuid/v4');
let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

let generatePassword = require('password-generator');
let senderAddress = 'theo.theunissen1@gmail.com'; // Replace this address with your actual address

module.exports = function(Teams) {
  // Add extension code here
  Teams.beforeRemote('create', function(context, unused, next) {
    context.args.data.uuid = uuidv4();
    context.args.data.creationdate = new Date().toISOString();
    context.args.data.createdby = context.req.connection.remoteAddress;
    context.args.data.modificationdate = new Date().toISOString();
    context.args.data.modifiedby = context.req.connection.remoteAddress;
    if (context.args.data.json) {
      context.args.data.json = JSON.stringify(context.args.data.json);
    }

    next();
  });

  // add data into related tables
  Teams.afterRemote('create', function(context, team, next) {
    let dataAr = [context.result.data];
    let modifier = context.req.connection.remoteAddress;
    let teamsId = team.id;
    let relationsId;
    let date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    function createRelationsWithTeams(relationsId) {
      let query = 'insert into relations_with_teams (\n' +
        'relations_id, \n' +
        'teams_id, \n' +
        'creationDate, \n' +
        'createdBy, \n' +
        'modificationDate, \n' +
        'modifiedBy) values (\n' +
        '\'' + relationsId + '\',\n' +
        '\'' + teamsId + '\',\n' +
        '\'' + date + '\',\n' +
        '\'' + modifier + '\',\n' +
        '\'' + date + '\',\n' +
        '\'' + modifier + '\'\n' +
        ');';
      let params = [1];
      // console.log('>>>>> query: ', query);
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          dataAr.push(data);
          // create relations_with_locations record
          console.log('Done with team creation. ' +
            'Created records in relations, locations, ' +
            'teams and relations_with_teams');
          context.result.relationsId = relationsId;
          next();
        }
      });
    }

    function createRelation(locationsId) {
      let password = generatePassword(12, false);
      let description = context.args.data.relation.description ||
        'Created with team';
      let json = '{}';
      if (context.args.data.relation && context.args.data.relation.json !==
        undefined && context.args.data.relation.json !== null) {
        json = JSON.stringify(context.args.data.relation.json);
      }
      let username = context.args.data.relation.username ||
        context.args.data.relation.email;
      let query = 'insert into relations (\n' +
        'uuid, \n' +
        'locations_id, \n' +
        'firstname, \n' +
        'prefix, \n' +
        'lastname, \n' +
        'phonenumber, \n' +
        'email, \n' +
        'username, \n' +
        'password, \n' +
        'description, \n' +
        'json, \n' +
        'creationDate, \n' +
        'createdBy, \n' +
        'modificationDate, \n' +
        'modifiedBy) values (\n' +
        '\'' + uuidv4() + '\',\n' +
        '\'' + locationsId + '\',\n' +
        '\'' + context.args.data.relation.firstname + '\',\n' +
        '\'' + context.args.data.relation.prefix + '\',\n' +
        '\'' + context.args.data.relation.lastname + '\',\n' +
        '\'' + context.args.data.relation.phonenumber + '\',\n' +
        '\'' + context.args.data.relation.email + '\',\n' +
        '\'' + username + '\',\n' +
        '\'' + password + password + '\',\n' +
        '\'' + description + '\',\n' +
        '\'' + json + '\',\n' +
        '\'' + date + '\',\n' +
        '\'' + modifier + '\',\n' +
        '\'' + date + '\',\n' +
        '\'' + modifier + '\'\n' +
        ');';
      let params = [1];
      // console.log('>>>>> query: ', query);
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          dataAr.push(data);
          relationsId = data.insertId;
          context.result.locationsId = locationsId;
          // create relations_with_locations record
          createRelationsWithTeams(relationsId);
        }
      });
    }

    // create locations record
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
      '\'' + context.args.data.location.streetname + '\',\n' +
      '\'' + context.args.data.location.housenumber + '\',\n' +
      '\'' + context.args.data.location.postalcode + '\',\n' +
      '\'' + context.args.data.location.city + '\',\n' +
      '\'created with team\',\n' +
      '\'' + date + '\',\n' +
      '\'' + modifier + '\',\n' +
      '\'' + date + '\',\n' +
      '\'' + modifier + '\'\n' +
      ');';
    let params = [1];
    // console.log('>>>>> query: ', query);
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        dataAr.push(data);
        let locationsId = data.insertId;

        // create relations record
        createRelation(locationsId);
      }
    });
  });

  function getQuery(id) {
    return 'select r.id,\n' +
      'r.uuid,\n' +
      'r.firstname,\n' +
      'r.prefix,\n' +
      'r.lastname,\n' +
      'concat(r.firstname, \' \', r.prefix, \' \',' +
      ' r.lastname) relationsName,\n' +
      'r.phonenumber,\n' +
      'r.email,\n' +
      'r.description,\n' +
      'r.json,\n' +
      'l.id locationsId,\n' +
      'l.streetname,\n' +
      'l.housenumber,\n' +
      'l.housenumber_suffix,\n' +
      'l.postalcode,\n' +
      'l.city\n' +
      'from relations r\n' +
      ', locations l\n' +
      ', teams t\n' +
      ', relations_with_teams  rwt\n' +
      'where t.id = ' + id + '\n' +
      'and l.id=r.locations_id\n' +
      'and t.id=rwt.teams_id\n' +
      'and r.id=rwt.relations_id';
  }

  // add data into related tables
  Teams.afterRemote('find', function(context, team, next) {
    let newResult = JSON.parse(JSON.stringify(context.result));
    function getRelationsWithTeam(i, teams) {
      if (i + 1 > teams.length || teams.length === 0) {
        context.result = newResult;
        next();
      } else {
        let id = teams[i].id;

        let query = getQuery(id);

        // console.log('>>>>>', query)
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            newResult[i].relations = data;
            // console.log('>>>>> i', i);
            // console.log('>>>>> data', data);
            // console.log('>>>>>  newResult', newResult[i]);
            i = i + 1;
            getRelationsWithTeam(i, team);
          }
        });
      }
    }

    getRelationsWithTeam(0, newResult);
  });

  function getTasksWithTeam(context, next) {
    let teamId = context.args.id;
    let query = 'select ta.*\n' +
      'from teams t\n' +
      ', relations_with_teams rwt\n' +
      ', relations r\n' +
      ', relations_with_tasks rwta\n' +
      ', tasks ta\n' +
      'where t.id=rwt.teams_id\n' +
      'and r.id=rwta.relations_id\n' +
      'and ta.id=rwta.tasks_id\n' +
      'and t.id=' + teamId + '\n' +
      'group by ta.id';
    let params = [];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
        next(err);
      } else {
        context.result.tasks = data;
        next();
      }
    });
  }

  // add data into related tables // replaceById
  Teams.afterRemote('findById', function(context, team, next) {
    console.log('>>>>> context.method.name', context.method.name);
    console.log('>>>>>', context.args);
    console.log('>>>>>', context.args.filter);
    console.log('>>>>> context.result', context.result);
    let query = getQuery(context.args.id);
    // console.log('>>>>> query: ', query);
    let params = [];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
        next(err);
      } else {
        if (context.args.filter && context.args.filter.tasks) {
          if (context.args.filter.relations !== undefined &&
            context.args.filter.relations === false) {
            context.result.relation = null;
          } else {
            context.result.relation = data;
          }
          getTasksWithTeam(context, next);
        } else {
          next();
        }
      }
    });
  });

  Teams.beforeRemote('replaceById', function(context, team, next) {
    // console.log('>>>>> context.method.name', context.method.name);
    // console.log('>>>>> context.args.data', context.args.data);
    // console.log('>>>>> context.result', context.result);
    //
    if (context.args.data.json !== undefined &&
      context.args.data.json !== null) {
      context.args.data.json = JSON.stringify(context.args.data.json);
    }

    function buildQuery(i, key, trailer) {
      let clause = '';
      if (context.args.data.relation[i][key] !== undefined &&
        context.args.data.relation[i][key] !== null &&
        key !== 'uuid') {
        if (key === 'json') {
          clause = key + ' = \'' +
            JSON.stringify(context.args.data.relation[i][key]) + '\'' + trailer;
        } else {
          clause = key + ' = \'' +
            context.args.data.relation[i][key] + '\'' + trailer;
        }
      } else {
        clause = '';
      }
      return clause;
    }

    function updateLocation() {
      if (context.args.data !== undefined &&
        context.args.data.relation !== undefined) {
        // console.log('xxxxx');
        for (let i = 0; i < context.args.data.relation.length; i++) {
          // console.log('iiiii', i);
          let query = 'update locations set \n';
          query += buildQuery(i, 'streetname', ',\n');
          query += buildQuery(i, 'housenumber', ',\n');
          query += buildQuery(i, 'housenumber_suffix', ',\n');
          query += buildQuery(i, 'postalcode', ',\n');
          query += buildQuery(i, 'city', ',\n');
          query += 'modificationDate = \'' +
            (new Date().toISOString().slice(0, 19).replace('T', ' ')) + '\',\n';
          query += 'modifiedBy = \'' +
            context.req.connection.remoteAddress + '\'\n';
          query += 'where id = ' + context.args.data.relation[i].locationsId;
          let params = [];
          ds.connector.execute(query, params, function(err, data) {
            if (err) {
              console.log(err);
            } else {

            }
          });
          next();
        }
      }
    }

    function updateRelation() {
      if (context.args.data !== undefined &&
        context.args.data.relation !== undefined) {
        // console.log('xxxxx');
        for (let i = 0; i < context.args.data.relation.length; i++) {
          // console.log('iiiii', i);
          let query = 'update relations set \n';
          query += buildQuery(i, 'firstname', ',\n');
          query += buildQuery(i, 'prefix', ',\n');
          query += buildQuery(i, 'lastname', ',\n');
          query += buildQuery(i, 'phonenumber', ',\n');
          query += buildQuery(i, 'email', ',\n');
          query += buildQuery(i, 'description', ',\n');
          query += buildQuery(i, 'json', ',\n');
          query += 'modificationDate = \'' +
            (new Date().toISOString().slice(0, 19).replace('T', ' ')) + '\',\n';
          query += 'modifiedBy = \'' +
            context.req.connection.remoteAddress + '\'\n';
          query += 'where id = ' + context.args.data.relation[i].id;
          // console.log('>>>>> query: ', query);

          let params = [];
          ds.connector.execute(query, params, function(err, data) {
            if (err) {
              console.log(err);
            } else {

            }
          });
        }
        updateLocation();
      }
    }
    updateRelation();
  });

  Teams.remoteMethod(
    'create', {
      http: {
        path: '/',
        verb: 'post',
      },
      returns: [
        {arg: 'id', type: 'string'},
        {arg: 'name', type: 'string'},
        {arg: 'description', type: 'string'},
        {arg: 'json', type: 'object'},
        {
          arg: 'relation', type: 'object', default: {
            firstname: 'string',
            prefix: 'string',
            lastname: 'string',
            phonenumber: 'string',
            email: 'string',
            description: 'string',
            json: 'object',
          },
        },
        {
          arg: 'location', type: 'object', default: {
            'streetname': 'string',
            'housenumber': 'string',
            'housenumberSuffix': 'string',
            'postalcode': 'string',
            'city': 'string',
          },
        },
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
        'Creates Team model with Relation and Location Model.',
    })
  ;

  Teams.remoteMethod(
    'replaceById', {
      http: {
        path: '/:id',
        verb: 'put',
      },
      returns: [
        {arg: 'id', type: 'string'},
        {arg: 'uuid', type: 'string'},
        {arg: 'name', type: 'string'},
        {arg: 'description', type: 'string'},
        {arg: 'json', type: 'object'},
        {
          arg: 'relation', type: 'object', default: [{
            id: 'string',
            uuid: 'string',
            firstname: 'string',
            prefix: 'string',
            lastname: 'string',
            phonenumber: 'string',
            email: 'string',
            description: 'string',
            json: 'object',
            locationsId: 'string',
            streetname: 'string',
            housenumber: 'string',
            housenumberSuffix: 'string',
            postalcode: 'string',
            city: 'string',
          },
          ],
        },
      ],
      accepts: [
        {
          arg: 'id',
          type: 'string',
          http: {source: 'path'},
          required: true,
          description:
            'Model id',
        },
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
        'Updates Team model with Relation and Location Model.',
    })
  ;

  // Disabled remote methods
  let methods = [
    'confirm',
    'count',
    // 'create',
    'createChangeStream',
    'delete',
    'deleteById',
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
    Teams.disableRemoteMethodByName(methods[i]);
  }
}
;
