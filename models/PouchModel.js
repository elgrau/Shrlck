'use strict';

var modules = require('../modules');
var PouchDB = require('pouchdb');

function PouchModel(name) {
  this.name = name;
  this.database = new PouchDB(__dirname + "/database/" + name + ".json");
};

PouchModel.prototype = {

  database: function() {
    return this.database;
  },

  all: function() {
    var options = {"include_docs": true};
    return this.database.allDocs(options, function() {});
  },

  query: function(fun, options, callback) {
    return this.database.query(fun, options, callback);
  },

  save: function(data) {
    if (_.isUndefined(data._id)) {
      return this.post(data);
    } else {
      return this.put(data);
    }
  },

  getModel: function(data) {
    return this.database.get(data);
  },

  put: function(data) {
    var _database = this.database;

    return _database.get(data._id).then(function(doc) {
      data._rev = doc._rev;
      return _database.put(data);
    }).catch(function(error) {
      return _database.put(data);
    });
  },

  post: function(data) {
    return this.database.post(data);
  }
}

module.exports = PouchModel;