'use strict';

var pouchdb = require('./pouchdb');
var email = require('./mail/email');

var modules = {
  database: pouchdb,
  email: email
}

module.exports = modules;