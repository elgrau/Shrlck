'use strict';
/*
	api definition for users
*/
var models = require('../../models');

var game = {

  start: function (req, res) {

    var users = models.user.all();
    console.log(users);
    var teams = models.team.createTeams(users);

    return res.status(200).json({
      payload: teams,
      message: "game started"
    });

    //models.game.start().then(function (teams) {
    //  return res.status(200).json({
    //    payload: {},
    //    message: "game started"
    //  });
    //});
    //.catch(function (error) {
    //  console.log("error:" + error);
    //  return res.status(400).json({
    //    error: "" + error,
    //    message: "game not started."
    //  });
    //});
  }
}

module.exports = game;