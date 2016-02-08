'use strict';

var PouchDB = require('pouchdb');

function Database() {}

Database.prototype = {
  table: function(name) {
    return new PouchDB(name);
  }

}

// Default instance
var database = new Database();

module.exports = database;