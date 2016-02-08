'use strict';

var PouchModel = require('./PouchModel');
var inherits = require('util').inherits;

function Game() {
  PouchModel.call(this, 'game');
};

inherits(Game, PouchModel);

Game.prototype.createTeams = function() {

  return Game.super_.prototype.all.call(this).then(function(users) {
    if (users.total_rows > 0) {
      var teamA = [];
      var teamB = [];

      for (var key in users.rows) {
        teamA.push(users.rows[key].id);
      }

      var size = Math.floor(teamA.length / 2);
      for (var i = 0; i < size; i++) {
        var index = Math.floor(Math.random() * teamA.length);

        teamB.push(teamA[index]);
        teamA.splice(index, 1);
      }

      return [{
        "id": "A",
        "users": teamA
      }, {
        "id": "B",
        "users": teamB
      }];
    } else {
      return [];
    }
  });
}

module.exports = Game;