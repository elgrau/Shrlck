/* global app */
'use strict';

var path = require('path');
var low = require('lowdb');
var storage = require('lowdb/file-async');
var db = low(path.join(__dirname, '../resources/database/db.json'), {
	"storage": storage
});

module.exports = db;