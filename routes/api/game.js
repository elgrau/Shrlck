'use strict';
/*
	api definition for users
*/
var util = require('util');
var resourceLoader = require('../../modules/resourceLoader');
var emailSender = require('../../modules/mail/email');
var database = require('../../modules/database');


var game = {


  start: function(req, res) {
    database.all('users').then(function(users) {
      console.log(users);
      if (users.length > 0) {
        var teamA = [];
        var teamB = [];

        for (var key in users) {
          teamA.push(users[key].identifier);
        }

        var size = Math.floor(teamA.length / 2);
        for (var i = 0; i < size; i++) {
          var index = Math.floor(Math.random() * teamA.length);

          teamB.push(teamA[index]);
          teamA.splice(index, 1);
        }

        database.save('teams', [teamA, teamB]).then(function() {
          database.commit();
          return res.status(200).json({
            payload: {},
            message: "game started"
          });
        }).catch(function(error) {
          return res.status(400).json({
            error: error,
            message: "game not started"
          });
        });
      } else {
        return res.status(400).json({
          error: "the game cannot start because any user has been registered",
          message: "game not started"
        });
      }
    });
  }
}

module.exports = game;