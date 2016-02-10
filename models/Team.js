'use strict';

var database = require('../modules').database;
var _ = require('lodash');

function Team() {};

Team.prototype.all = function () {
  return database.object.teams;
}

Team.prototype.get = function (teams, criteria) {
  return teams.find(criteria);
}

Team.prototype.findByUser = function (teams, email) {

  var team = teams.find(function (value) {
    return _.contains(value.users, email);
  });
  return team;
}

Team.prototype.createTeams = function (users, numberOfTeams) {
  var teams = [];

  if (users.length > 0) {

    var shuffledUsers = _.map(_.shuffle(users), 'email');

    var teamSize = Math.floor(shuffledUsers.length / numberOfTeams);
    var rest = shuffledUsers.length % numberOfTeams;

    for (var i = 1; i <= numberOfTeams; i++) {
      var usersTeam = _.remove(shuffledUsers, function (value, index) {
        return index < teamSize || (index == teamSize && i <= rest);
      });

      //var usersTeam = _.drop(shuffledUsers, i <= rest ? teamSize + 1 : teamSize);
      teams.push({
        "id": i,
        "users": usersTeam
      });
    }
  }
  return teams;
}

var team = new Team();

module.exports = team;