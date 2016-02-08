'use strict';

var Game = require('./Game');
var User = require('./User');
var Team = require('./Team');

var models = {
  game: new Game(),
  user: new User(),
  team: new Team()
}

module.exports = models;