'use strict';
/*
	api definition for users
*/
var models = require('../../models');

var game = {

  start: function(req, res) {
    var id = req.params.id;

    models.game.start(id).then(function() {
      return res.status(200).json({
        payload: {},
        message: "game started"
      });
    }).catch(function(error) {
      return res.status(400).json({
        error: error,
        message: "Cannot start the game."
      });
    });
  },

  requestClue: function(req, res) {

    var user = req.session.user;

    if (user) {
      models.game.requestClue(user.email, req.body.clue).then(function() {
        return res.status(200).json({
          payload: {},
          message: "success"
        });
      }).catch(function(error) {
        return res.status(400).json({
          error: error,
          message: error
        });
      });
    } else {
      return res.status(400).json({
        error: "",
        message: "Investigación no autorizada"
      });
    }

  }
}

module.exports = game;