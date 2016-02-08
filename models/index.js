'use strict';

var game = require('./Game');
var user = require('./User');
var team = require('./Team');

var modelInterface = {
	game: game,
	user: user,
	team: team
}

module.exports = modelInterface;