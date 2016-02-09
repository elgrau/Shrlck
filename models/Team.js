'use strict';

var database = require('../modules').database;
var _ = require('lodash');

function Team() {};

Team.prototype.get = function (criteria) {
  return database('teams').find(criteria);
}

Team.prototype.findByUser = function (email) {

  var team = database('teams').find(function (value) {
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

  return new Promise(function (resolve, reject) {
    database('teams').chain().assign(teams).value().then(function () {
      resolve(teams);
    }).catch(function (error) {
      reject(error);
    });
  });
}

var team = new Team();

module.exports = team;