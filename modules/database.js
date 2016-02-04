/* global app */
'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var jsonfile = require('jsonfile');
var uuid = require('node-uuid');

var databaseFile = path.join(__dirname, '../resources/database/database.json');
var resourceLoader = require('./resourceLoader.js');

function Database() {
  console.log(databaseFile);
  this.data = jsonfile.readFileSync(databaseFile);
}

Database.prototype = {
  load: function() {
    this.data = {};
    this.data['users'] = getTable(this, 'users');
    this.data['sessions'] = {};
  },

  all: function(table) {
    var _data = this.data;
    return new Promise(function(resolve, reject) {
      if (_data[table] != undefined) {
        console.log('database.resolve');
        resolve(_data[table]);
      } else {
        console.log('database.all.reject');
        reject(table);
      }
    });
  },

  get: function(table, id) {
    var _data = this.data;

    return new Promise(function(resolve, reject) {
      if (_data[table] != undefined && _data[table][getKey(id)] != undefined) {
        resolve(_data[table][getKey(id)]);
      } else {
        reject(table, id);
      }
    });
  },

  save: function(table, object) {
    var _data = this.data;

    return new Promise(function(resolve, reject) {
      var identifier = getIdentifier(this, object);

      if (_data[table] != undefined) {
        object.identifier = identifier;
        _data[table].push(object);
        resolve(object);
      } else {
        reject(table, object);
      }
    });
  },

  commit: function() {
    console.log(this.data)
    jsonfile.writeFileSync(databaseFile, this.data);
  },

  findBy: function(table, field, value) {
    var _data = this.data;
    return new Promise(function(resolve, reject) {
      var rows = _data[table];

      if (rows != undefined) {
        for (var key in rows) {
          var row = rows[key];
          console.log(row);
          console.log(row[field]);
          if (row[field] && row[field] === value) {
            resolve(row);
          }
        }
      }
      resolve({});
    });
  }
}

var getKey = function(id) {
  return '' + id;
}

var getIdentifier = function(database, object) {
  if (object.identifier) {
    return object.identifier;
  } else {
    return uuid.v1();
  }
}

var getTable = function(database, table) {
  var list = {};

  var tablePath = path.join(databasePath, table);

  var rows = fs.readdirSync(tablePath);

  for (var i in rows) {
    var dataTable = require(path.join(tablePath, rows[i]));

    if (!_.isFunction(dataTable)) {
      dataTable = _.clone(dataTable);
    }

    var identifier = getIdentifier(database, dataTable);
    list[getKey(identifier)] = dataTable;
  }

  return list;
}

// Default instance
var database = new Database();
//database.load();

module.exports = database;