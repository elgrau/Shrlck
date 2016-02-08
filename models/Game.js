'use strict';

var database = require('../modules').database;

function Game() {};

Game.prototype.get = function (criteria) {
  return database('games').find(criteria);
}

var game = new Game();

module.exports = game;