'use strict';
/*
	api definition for users
*/
var models = require('../../models');

var game = {

  start: function (req, res) {

    models.game.start().then(function (teams) {
      return res.status(200).json({
        payload: {},
        message: "game started"
      });
    });
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