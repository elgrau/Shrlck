/* global app */
'use strict';

var low = require('lowdb');
var storage = require('lowdb/file-async');
var db = low('resources/database/db.json', {
	"storage": storage
});

module.exports = db;