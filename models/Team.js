'use strict';

var PouchModel = require('./PouchModel');
var inherits = require('util').inherits;
var models = require('./index');

function Team() {
  PouchModel.call(this, 'team');
};

inherits(Team, PouchModel);

Team.prototype.random = function(users) {

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

    var teams = [{
      "_id": "A",
      "users": teamA
    }, {
      "_id": "B",
      "users": teamB
    }];

    var database = Team.super_.prototype.database.call(this);
    return database.bulkDocs(teams);
  } else {
    console.log('nada');
    return [];
  }
}

Team.prototype.findByUser = function(email) {

  return Team.super_.prototype.all.call(this).then(function(teams) {
    console.log(teams);
    var team = teams.filter(function() {
      return this._id == email;
    });

    console.log(team);
    return team;
  }).catch(function(error) {
    console.log(error);
    return undefined;
  });
}


module.exports = Team;