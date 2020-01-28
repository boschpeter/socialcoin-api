'use strict';
const uuidv4 = require('uuid/v4');

let server = require('../../server/server.js');
let ds = server.dataSources.socialcoinDb;

module.exports = function(Tasks) {
  let ctx = '';
  let modifier = '';
  // Add extension code here]
  Tasks.beforeRemote('**', function(context, unused, next) {
    ctx = context;
    // console.log('>>>>> ctx', ctx.args);
    modifier = context.req.connection.remoteAddress;
    if (context && context.args && context.args.data) {
      context.args.data.uuid = uuidv4();
      context.args.data.locationsId = 1;
      context.args.data.creationdate = new Date().toISOString();
      context.args.data.createdby = modifier;
      context.args.data.modificationdate = new Date().toISOString();
      context.args.data.modifiedby = modifier;
      context.args.data.phonenumber = context.args.data.phonenumber || '.';
      context.args.data.email = context.args.data.email || '.';
    }
    next();
  });

  Tasks.afterRemote('create', function(context, unused, next) {
    let taskId = context.result.id;
    let locationId = 0;
    let query = 'insert into tasks_with_status (' +
      'tasks_id, status_id, creationDate, createdBy, ' +
      'modificationDate, modifiedBy) \nvalues (' +
      taskId + ', ' + 30 +
      ', now(), \'' + modifier + '\'' +
      ', now(), \'' + modifier + '\')';
    let params = [];
    ds.connector.execute(query, params, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        // console.log('>>>>> context: ', context.args);
        let uuid = uuidv4();
        let relationsId = context.args.data.relationsId || 0;
        let streetname = context.args.data.location.streetname || '';
        let housenumber = context.args.data.location.housenumber || '';
        let housenumberSuffix = context.args.data.location.housenumberSuffix ||
          '';
        let postalcode = context.args.data.location.postalcode || '';
        let city = context.args.data.location.city || '';
        let description = context.args.data.location.description || '';
        let latitude = context.args.data.location.latitude || '';
        let longitude = context.args.data.location.longitude || '';
        let json = JSON.stringify(context.args.data.location.longitude || {});
        let creationDate = 'now()';
        let createdBy = modifier;
        let modificationDate = 'now()';
        let modifiedBy = modifier;
        query = 'insert into locations (\n' +
          'uuid, streetname, housenumber, housenumber_suffix, postalcode, ' +
          'city, description, latitude, longitude, json, creationDate, ' +
          'createdBy, modificationDate, modifiedBy)\nvalues (' +
          '\'' + uuid + '\', ' +
          '\'' + streetname + '\', ' +
          '\'' + housenumber + '\', ' +
          '\'' + housenumberSuffix + '\', ' +
          '\'' + postalcode + '\', ' +
          '\'' + city + '\', ' +
          '\'' + description + '\', ' +
          '\'' + latitude + '\', ' +
          '\'' + longitude + '\', ' +
          '\'' + json + '\', ' +
          creationDate + ', ' +
          '\'' + createdBy + '\', ' +
          modificationDate + ', ' +
          '\'' + modifiedBy + '\')';
        // console.log('>>>>> query: ', query);
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            locationId = data.insertId;
            // console.log('>>>>> data: ', data);
            let query = 'update tasks set locations_id=' + data.insertId +
              '\nwhere id=' + taskId;
            let params = [];
            ds.connector.execute(query, params, function(err, data) {
              if (err) {
                console.log(err);
              } else {
                // console.log('>>>>> context: ', context.args);
                // console.log('>>>>> data: ', data);
                let query = 'select count(1) cnt from relations_with_tasks\n' +
                  'where relations_id=' + relationsId +
                  '\nand tasks_id= ' + taskId;
                let params = [];
                // console.log('>>>>>qyert', query);
                ds.connector.execute(query, params, function(err, data) {
                  if (err) {
                    console.log(err);
                  } else {
                    if (data[0].cnt === 0) {
                      // console.log('>>>>> data: ', data);
                      let query = 'insert into relations_with_tasks\n(' +
                        'relations_id, tasks_id, creationDate, createdBy, ' +
                        'modificationDate, modifiedBy) values\n(' +
                        relationsId + ', ' + taskId + ', ' +
                        'now(), \'' + modifier + '\', ' +
                        'now(), \'' + modifier + '\');';
                      let params = [];
                      // console.log('>>>>>qyert', query);
                      ds.connector.execute(query, params, function(err, data) {
                        if (err) {
                          console.log(err);
                        } else {
                          // console.log('>>>>> context: ', context.args);
                          data.locationId = locationId;
                          context.result.locationsId = locationId;
                          context.result.location.id = locationId;
                          next();
                        }
                      });
                    }
                  }
                });
              }
            });
          }
        });
      }
    });
  });

  //
  Tasks.beforeRemote('__updateById__statuses', function(context,
                                                        unused, next) {
    // console.log('>>>>> afterRemote', context.method.name);
    // console.log('>>>>> afterRemote', context.args.data);
  });

  //
  Tasks.afterRemote('findById', function(context, unused, next) {
    let filter = '';

    if (context.args && context.args.filter) {
      filter = context.args.filter;
    }

    let transactionsClause = '';
    let tasks = [];

    function getActions() {
      let i = 0;
      for (i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        _getActions(i, task.taskId);
      }
    }

    function _getActions(i, taskId) {
      let query = 'select a.*, f.url\n' +
        'from (actions a,\n' +
        'tasks_with_actions twa)\n' +
        'left join files f on f.id=a.files_id\n' +
        'where twa.tasks_id=' + taskId + '\n' +
        'and a.id=twa.actions_id\n';
      let params = [];
      // console.log('>>>>>', query)
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          next(err);
          return 'sssi';
        } else {
          tasks[i].actions = data;
        }
        if (i + 1 === tasks.length) {
          context.result = tasks;
          next();
        }
      });
    }

    function getRelations() {
      let i = 0;
      for (i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        _getRelations(i, task.taskId);
      }
    }

    function _getRelations(i, taskId) {
      let clauses = [];
      if (filter !== undefined && filter !== null &&
        filter.where !== undefined && filter.where !== null) {
        if (filter.where.and) {
          for (let i = 0; i < filter.where.and.length; i++) {
            if (filter.where.and[i].roleId !== undefined &&
              filter.where.and[i].roleId !== null) {
              clauses.push(' ro.id = ' + filter.where.and[i].roleId);
            }
            if (filter.where.and[i].relationId !== undefined &&
              filter.where.and[i].relationId !== null) {
              clauses.push(' r.id = ' + filter.where.and[i].relationId);
            }
          }
        }
        if (filter.where.roleId !== undefined && filter.where.roleId !== null) {
          clauses.push(' ro.id = ' + filter.where.roleId);
        }
        if (filter.where.relationId !== undefined &&
          filter.where.relationId !== null) {
          clauses.push(' r.id = ' + filter.where.relationId);
        }
      }
      let clausStr = '';
      if (clauses.length > 0) {
        clausStr = clauses.join(' and ') + ' and ';
      }
      let query = 'select r.id relationId,\n' +
        'r.uuid relationUuid,\n' +
        'r.firstname relationFirstname,\n' +
        'r.prefix relationPrefix,\n' +
        'r.lastname relationLastname,\n' +
        'r.date_of_birth relationDateOfBirth,\n' +
        'r.phonenumber relationPhonenumber,\n' +
        'r.email relationEmail,\n' +
        'r.json relationJson,\n' +
        'r.description relationDescriptrion,\n' +
        'l.id taskLocationId,\n' +
        'l.streetname locationStreetname,\n' +
        'l.housenumber locationHousenumber,\n' +
        'l.housenumber_suffix locationHousenumberSuffix,\n' +
        'l.postalcode taskLocationPostalcode,\n' +
        'l.city taskLocationCity,\n' +
        'l.latitude taskLocationLatitude,\n' +
        'l.longitude taskLocationLongitude,\n' +
        'l.description taskLocationDescription,\n' +
        'l.json taskLocationJson,\n' +
        'ro.id roleId,\n' +
        'ro.uuid roleUuid,\n' +
        'ro.name roleName\n' +
        'from (relations r,\n' +
        'locations l,\n' +
        'relations_with_roles rwr,\n' +
        'roles ro,\n' +
        'relations_with_tasks rwt\n' +
        ')\n' +
        'where ' + taskId + '=rwt.tasks_id and ' + clausStr + '\n' +
        'l.id=r.locations_id\n' +
        'and r.id=rwr.relations_id\n' +
        'and ro.id=rwr.roles_id\n' +
        'and r.id=rwt.relations_id';
      // console.log('>>>>> quwey: ', query);
      let params = [];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          // console.log('........', err);
          console.log(err);
          next(err);
        } else {
          tasks[i].relations = data;
        }
        // console.log('>>>>> i, tasks.length', i, tasks.length)
        if (i + 1 === tasks.length) {
          getActions();
        }
      });
    }

    function getTasks() {
      let clauses = [];
      let relationClause = '';
      if (filter !== undefined && filter !== null &&
        filter.where !== undefined && filter.where !== null) {
        if (filter.where.and) {
          for (let i = 0; i < filter.where.and.length; i++) {
            if (filter.where.and[i].taskId !== undefined &&
              filter.where.and[i].taskId !== null) {
              clauses.push(' t.id = ' + filter.where.and[i].taskId);
            }
            if (filter.where.and[i].statusId !== undefined &&
              filter.where.and[i].statusId !== null) {
              clauses.push(' s.id = ' + filter.where.and[i].statusId);
            }
            if (filter.where.and[i].relationId !== undefined &&
              filter.where.and[i].relationId !== null) {
              relationClause = '\nand t.id in ' +
                '(select tasks_id from relations_with_tasks ' +
                'where relations_id=' + filter.where.and[i].relationId + ')';
            }
          }
        }
        if (filter.where.taskId !== undefined && filter.where.taskId !== null) {
          clauses.push(' t.id = ' + filter.where.taskId);
        }
        if (filter.where.statusId !== undefined &&
          filter.where.statusId !== null) {
          clauses.push(' s.id = ' + filter.where.statusId);
        }
        if (filter.where.relationId !== undefined &&
          filter.where.relationId !== null) {
          relationClause = '\nand t.id in ' +
            '(select tasks_id from relations_with_tasks ' +
            'where relations_id=' + filter.where.relationId + ')';
        }
      }
      let clausStr = '';
      if (clauses.length > 0) {
        clausStr = clauses.join(' and ');
      }
      let query = ' select t.id taskId,\n' +
        't.uuid taskUuid,\n' +
        't.name taskName,\n' +
        't.description taskDescription,\n' +
        't.value_sc taskValueSc,\n' +
        't.phonenumber taskPhonenumber,\n' +
        't.email taskEmail,\n' +
        't.startDate taskStartDate,\n' +
        't.endDate taskEndDate,\n' +
        't.effort taskEffort,\n' +
        't.creationDate taskCreationDate,\n' +
        't.createdBy taskCreatedBy,\n' +
        't.modificationDate taskModificationDate,\n' +
        't.modifiedBy taskModifiedBy,\n' +
        'l.id taskLocationId,\n' +
        'l.streetname locationStreetname,\n' +
        'l.housenumber locationHousenumber,\n' +
        'l.housenumber_suffix locationHousenumberSuffix,\n' +
        'l.postalcode taskLocationPostalcode,\n' +
        'l.city taskLocationCity,\n' +
        'l.latitude taskLocationLatitude,\n' +
        'l.longitude taskLocationLongitude,\n' +
        'l.description taskLocationDescription,\n' +
        'l.json taskLocationJson,\n' +
        's.id statusId,\n' +
        's.uuid statusUuid,\n' +
        's.name statusName,\n' +
        's.description statusDescription,\n' +
        's.json statusJson\n' +
        'from (tasks t,\n' +
        'locations l\n' +
        ')\n' +
        'left join tasks_with_status swt on t.id=swt.tasks_id\n' +
        'left join status s on s.id=swt.status_id \n' +
        'where t.id=' + context.args.id + clausStr +
        ' and l.id=t.locations_id\n' +
        relationClause;
      // console.log('>>>>> quwey: ', query);
      let params = [];
      // console.log('>>>>> query:', query);
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
          next(err);
        } else {
          tasks = data;
          getRelations();
        }
      });
    }
    getTasks();
  });

  //
  Tasks.afterRemote('find', function(context, unused, next) {
    let filter = '';

    if (context.args && context.args.filter) {
      filter = context.args.filter;
    }

    let transactionsClause = '';
    let tasks = [];

    function getActions() {
      let i = 0;
      for (i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        _getActions(i, task.taskId);
      }
    }

    function _getActions(i, taskId) {
      let query = 'select a.*, f.url\n' +
        'from (actions a,\n' +
        'tasks_with_actions twa)\n' +
        'left join files f on f.id=a.files_id\n' +
        'where twa.tasks_id=' + taskId + '\n' +
        'and a.id=twa.actions_id\n';
      let params = [];
      // console.log('>>>>>', query)
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          next(err);
          return 'sssi';
        } else {
          tasks[i].actions = data;
        }
        if (i + 1 === tasks.length) {
          context.result = tasks;
          next();
        }
      });
    }

    function getRelations() {
      let i = 0;
      for (i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        _getRelations(i, task.taskId);
      }
    }

    function _getRelations(i, taskId) {
      let clauses = [];
      if (filter !== undefined && filter !== null &&
        filter.where !== undefined && filter.where !== null) {
        if (filter.where.and) {
          for (let i = 0; i < filter.where.and.length; i++) {
            if (filter.where.and[i].roleId !== undefined &&
              filter.where.and[i].roleId !== null) {
              clauses.push(' ro.id = ' + filter.where.and[i].roleId);
            }
            if (filter.where.and[i].relationId !== undefined &&
              filter.where.and[i].relationId !== null) {
              clauses.push(' r.id = ' + filter.where.and[i].relationId);
            }
          }
        }
        if (filter.where.roleId !== undefined && filter.where.roleId !== null) {
          clauses.push(' ro.id = ' + filter.where.roleId);
        }
        if (filter.where.relationId !== undefined &&
          filter.where.relationId !== null) {
          clauses.push(' r.id = ' + filter.where.relationId);
        }
      }
      let clausStr = '';
      if (clauses.length > 0) {
        clausStr = clauses.join(' and ') + ' and ';
      }
      let query = 'select r.id relationId,\n' +
        'r.uuid relationUuid,\n' +
        'r.firstname relationFirstname,\n' +
        'r.prefix relationPrefix,\n' +
        'r.lastname relationLastname,\n' +
        'r.date_of_birth relationDateOfBirth,\n' +
        'r.phonenumber relationPhonenumber,\n' +
        'r.email relationEmail,\n' +
        'r.json relationJson,\n' +
        'r.description relationDescriptrion,\n' +
        'l.id taskLocationId,\n' +
        'l.streetname locationStreetname,\n' +
        'l.housenumber locationHousenumber,\n' +
        'l.housenumber_suffix locationHousenumberSuffix,\n' +
        'l.postalcode taskLocationPostalcode,\n' +
        'l.city taskLocationCity,\n' +
        'l.latitude taskLocationLatitude,\n' +
        'l.longitude taskLocationLongitude,\n' +
        'l.description taskLocationDescription,\n' +
        'l.json taskLocationJson,\n' +
        'ro.id roleId,\n' +
        'ro.uuid roleUuid,\n' +
        'ro.name roleName\n' +
        'from (relations r,\n' +
        'locations l,\n' +
        'relations_with_roles rwr,\n' +
        'roles ro,\n' +
        'relations_with_tasks rwt\n' +
        ')\n' +
        'where ' + taskId + '=rwt.tasks_id and ' + clausStr + '\n' +
        'l.id=r.locations_id\n' +
        'and r.id=rwr.relations_id\n' +
        'and ro.id=rwr.roles_id\n' +
        'and r.id=rwt.relations_id';
      console.log('>>>>> quwey: ', query);
      let params = [];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          // console.log('........', err);
          console.log(err);
          next(err);
        } else {
          tasks[i].relations = data;
        }
        console.log('>>>>>i + 1, tasks.length', i + 1, tasks.length);
        if (i + 1 === tasks.length) {
          getActions();
        }
      });
    }

    function getTasks() {
      let clauses = [];
      let relationClause = '';
      if (filter !== undefined && filter !== null &&
        filter.where !== undefined && filter.where !== null) {
        if (filter.where.and) {
          for (let i = 0; i < filter.where.and.length; i++) {
            if (filter.where.and[i].taskId !== undefined &&
              filter.where.and[i].taskId !== null) {
              clauses.push(' t.id = ' + filter.where.and[i].taskId);
            }
            if (filter.where.and[i].statusId !== undefined &&
              filter.where.and[i].statusId !== null) {
              clauses.push(' s.id = ' + filter.where.and[i].statusId);
            }
            if (filter.where.and[i].relationId !== undefined &&
              filter.where.and[i].relationId !== null) {
              relationClause = '\nand t.id in ' +
                '(select tasks_id from relations_with_tasks ' +
                'where relations_id=' + filter.where.and[i].relationId + ')';
            }
          }
        }
        if (filter.where.taskId !== undefined && filter.where.taskId !== null) {
          clauses.push(' t.id = ' + filter.where.taskId);
        }
        if (filter.where.statusId !== undefined &&
          filter.where.statusId !== null) {
          clauses.push(' s.id = ' + filter.where.statusId);
        }
        if (filter.where.relationId !== undefined &&
          filter.where.relationId !== null) {
          relationClause = '\nand t.id in ' +
            '(select tasks_id from relations_with_tasks ' +
            'where relations_id=' + filter.where.relationId + ')';
        }
      }
      let clausStr = '';
      if (clauses.length > 0) {
        clausStr = clauses.join(' and ') + ' and ';
      }
      let query = ' select t.id taskId,\n' +
        't.uuid taskUuid,\n' +
        't.name taskName,\n' +
        't.description taskDescription,\n' +
        't.value_sc taskValueSc,\n' +
        't.phonenumber taskPhonenumber,\n' +
        't.email taskEmail,\n' +
        't.startDate taskStartDate,\n' +
        't.endDate taskEndDate,\n' +
        't.effort taskEffort,\n' +
        't.creationDate taskCreationDate,\n' +
        't.createdBy taskCreatedBy,\n' +
        't.modificationDate taskModificationDate,\n' +
        't.modifiedBy taskModifiedBy,\n' +
        'l.id taskLocationId,\n' +
        'l.streetname locationStreetname,\n' +
        'l.housenumber locationHousenumber,\n' +
        'l.housenumber_suffix locationHousenumberSuffix,\n' +
        'l.postalcode taskLocationPostalcode,\n' +
        'l.city taskLocationCity,\n' +
        'l.latitude taskLocationLatitude,\n' +
        'l.longitude taskLocationLongitude,\n' +
        'l.description taskLocationDescription,\n' +
        'l.json taskLocationJson,\n' +
        's.id statusId,\n' +
        's.uuid statusUuid,\n' +
        's.name statusName,\n' +
        's.description statusDescription,\n' +
        's.json statusJson\n' +
        'from (tasks t,\n' +
        'locations l\n' +
        ')\n' +
        'left join tasks_with_status swt on t.id=swt.tasks_id\n' +
        'left join status s on s.id=swt.status_id \n' +
        'where ' + clausStr + ' l.id=t.locations_id\n' +
        relationClause;
      // console.log('>>>>> quwey: ', query);
      let params = [];
      // console.log('>>>>> query:', query);
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
          next(err);
        } else {
          tasks = data;
          if (tasks.length > 0) {
            getRelations();
          } else {
            context.result = tasks;
            next();
          }
        }
      });
    }
    getTasks();
  });

  Tasks.patchAttributes = function(taskId, body, cb) {
    // console.log('>>>>> taskId', taskId);
    // console.log('>>>>> body', body);
    // console.log('>>>>> ctx', ctx.args);

    let result = {};
    function buildClause(obj, key, fieldname) {
      let retVal = null;
      // console.log('>>>>> obj, key', obj, key)
      if (obj && key && (obj[key] !== undefined && obj[key] !== null &&
        obj[key] !== 'null') || fieldname === '') {
        if (key === 'json') {
          retVal = fieldname + '=\'' + JSON.stringify(obj[key]) + '\'';
        } else {
          retVal = fieldname + '=\'' + obj[key] + '\'';
        }
      }
      return retVal;
    }

    // update task
    function updateTask() {
      let clauseAr = [];
      clauseAr.push(buildClause(body, 'name', 'name'));
      clauseAr.push(buildClause(body, 'description', 'description'));
      clauseAr.push(buildClause(body, 'phonenumber', 'phonenumber'));
      clauseAr.push(buildClause(body, 'email', 'email'));
      clauseAr.push(buildClause(body, 'valueSc', 'value_sc'));
      clauseAr.push(buildClause(body, 'json', 'json'));
      clauseAr.push(buildClause(body, 'startDate', 'startDate'));
      clauseAr.push(buildClause(body, 'endDate', 'endDate'));
      clauseAr.push(buildClause(body, 'effort', 'effort'));
      clauseAr.push('modificationDate=now()');
      clauseAr.push('modifiedBy=\'' + modifier + '\'');
      let temp = [];
      for (let i of clauseAr) {
        i && temp.push(i); // copy each non-empty value to the 'temp' array
      }
      clauseAr = temp;
      let clauses = clauseAr.join(',\n');
      let query = 'update tasks set\n' + clauses + '\nwhere id = ' + taskId;
      let params = [];
      ds.connector.execute(query, params, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          result.task = data;
          updateRelation();
        }
      });
    }
    // update relation
    function updateRelation() {
      if (body && body.relation) {
        let relation = body.relation;
        // console.log('>>>>> relation', body.relation, '<<<<<')

        let clauseAr = [];
        clauseAr.push(buildClause(relation, 'firstname', 'firstname'));
        clauseAr.push(buildClause(relation, 'prefix', 'prefix'));
        clauseAr.push(buildClause(relation, 'lastname', 'lastname'));
        clauseAr.push(buildClause(relation, 'dateOfBirth', 'date_of_birth'));
        clauseAr.push(buildClause(relation, 'phonenumber', 'phonenumber'));
        clauseAr.push(buildClause(relation, 'email', 'email'));
        clauseAr.push(buildClause(relation, 'description', 'description'));
        clauseAr.push(buildClause(relation, 'json', 'json'));
        clauseAr.push('modificationDate=now()');
        clauseAr.push('modifiedBy=\'' + modifier + '\'');
        let temp = [];
        for (let i of clauseAr) {
          i && temp.push(i); // copy each non-empty value to the 'temp' array
        }
        clauseAr = temp;
        let clauses = clauseAr.join(',\n');
        let query = 'update relations set\n' + clauses +
          '\nwhere id = ' + relation.id;
        let params = [];
        // console.log('>>>>> updateRelation query:', query);
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            result.relation = data;
          }
          updateLocation();
        });
      } else {
        updateLocation();
      }
    }
    // update location
    function updateLocation() {
      if (body && body.location) {
        let location = body.location;

        let clauseAr = [];
        clauseAr.push(buildClause(location, 'streetname', 'streetname'));
        clauseAr.push(buildClause(location, 'housenumber', 'housenumber'));
        clauseAr.push(buildClause(location, 'housenumberSuffix',
          'housenumber_suffix'));
        clauseAr.push(buildClause(location, 'postalcode', 'postalcode'));
        clauseAr.push(buildClause(location, 'city', 'city'));
        clauseAr.push(buildClause(location, 'latitude', 'latitude'));
        clauseAr.push(buildClause(location, 'longitude', 'longitude'));
        clauseAr.push(buildClause(location, 'description', 'description'));
        clauseAr.push(buildClause(location, 'json', 'json'));
        clauseAr.push('modificationDate=now()');
        clauseAr.push('modifiedBy=\'' + modifier + '\'');
        let temp = [];
        for (let i of clauseAr) {
          i && temp.push(i); // copy each non-empty value to the 'temp' array
        }
        clauseAr = temp;
        let clauses = clauseAr.join(',\n');
        let query = 'update locations set\n' + clauses +
          '\nwhere id = ' + location.id;
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            result.location = data;
          }
          updateStatus();
        });
        // console.log('>>>>> query:', query);
      } else {
        updateStatus();
      }
    }
    // update role
    function updateStatus() {
      let statusId = 0;
      if (body.status && body.status.id) {
        statusId = body.status.id;

        let query = 'select id from tasks_with_status where tasks_id=' +
          taskId;
        // console.log('>>>>> query:', query);
        let params = [];
        ds.connector.execute(query, params, function(err, data) {
          if (err) {
            console.log(err);
          } else {
            if (data.length === 0) {
              query = 'insert into tasks_with_status (' +
                'tasks_id, status_id, creationDate, createdBy, ' +
                'modificationDate, modifiedBy) values (\n' +
                taskId + ', ' + statusId + ',' +
                'now(), ' +
                '\'' + modifier + '\', ' +
                'now(), ' +
                '\'' + modifier + '\')';
            } else {
              query = 'update tasks_with_status set ' +
                'status_id=' + statusId + ',\n' +
                'modificationDate=now(),\n' +
                'modifiedBy=\'' + modifier + '\' ' +
                'where id = ' + data[0].id;
            }
            // console.log('>>>>> query:', query);
            let params = [];
            ds.connector.execute(query, params, function(err, data) {
              if (err) {
                console.log(err);
              }
              cb(null, result);
            });
          }
        });
      } else {
        cb(null, result);
      }
    }
    updateTask();
  };

  Tasks.remoteMethod(
    'patchAttributes', {
      http: {
        path: '/:id',
        verb: 'patch',
      },
      returns: [
        {arg: 'tasksId', type: 'string'},
        {arg: 'uuid', type: 'string'},
        {arg: 'name', type: 'string'},
        {arg: 'valueSc', type: 'Number'},
        {arg: 'phonenumber', type: 'string'},
        {arg: 'email;', type: 'string'},
        {arg: 'startDate', type: 'string'},
        {arg: 'endDate', type: 'string'},
        {arg: 'effort', type: 'string'},
        {arg: 'description', type: 'string'},
        {arg: 'json', type: 'object'},
        {
          arg: 'relation', type: 'object', default: {
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
            latitude: 'string',
            longitude: 'string',
          },
        },
        // {
        //   arg: 'role', type: 'object', default: {
        //     id: 'string',
        //     uuid: 'string',
        //     name: 'string',
        //   },
        // },
        {
          arg: 'status', type: 'object', default: {
            id: 'string',
            // uuid: 'string',
            // name: 'string',
            description: 'string',
            json: 'object',
          },
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
    'deleteById',
    'exists',
    // 'find',
    // 'findById',
    'findOne',
    // 'patchAttributes',
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
    Tasks.disableRemoteMethodByName(methods[i]);
  }
};
