'use strict';

var database = require('../modules').database;

function Team() {};

Team.prototype.get = function (criteria) {
  return database('teams').find(criteria);
}

Team.prototype.createTeams = function (users) {

  if (users.length > 0) {
    var teamA = [];
    var teamB = [];

    for (var key in users) {
      teamA.push(users[key].email);
    }
    console.log(teamA);

    var size = Math.floor(teamA.length / 2);
    for (var i = 0; i < size; i++) {
      var index = Math.floor(Math.random() * teamA.length);

      teamB.push(teamA[index]);
      teamA.splice(index, 1);
    }

    var teams = [{
      "id": "A",
      "users": teamA
    }, {
      "id": "B",
      "users": teamB
    }];
    console.log(teams);

    database.object.teams = teams;
    database.write();
    return teams;

  } else {
    console.log('nada');
    return [];
  }
}

var team = new Team();

module.exports = team;