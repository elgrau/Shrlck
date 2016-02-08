'use strict';
/*
	api definition for users
*/
var models = require('../../models');

var game = {

  start: function(req, res) {
    //  models.game.save({
    //    "_id": "3",
    //    "name": "arkam3",
    //    "title": "hello3"
    //  }).then(function(result) {
    //    return res.status(200).json({
    //      payload: result,
    //      message: "game saved"
    //    });
    //  }).catch(function(error) {
    //    return res.status(400).json({
    //      error: "" + error,
    //      message: "error"
    //    });
    //  });

    models.user.all().then(function(users) {
      var teams = models.team.random(users);

      return res.status(200).json({
        payload: teams,
        message: "game started"
      });

      //models.team.random(users).then(function(teams) {
      //  return res.status(200).json({
      //    payload: teams,
      //    message: "game started"
      //  });
      //}).catch(function(error) {
      //  return res.status(400).json({
      //    error: "" + error,
      //    message: "game not started."
      //  });
      //});
    }).catch(function(error) {
      return res.status(400).json({
        error: "" + error,
        message: "game not started."
      });
    });




    //    models.game.start().then(function(teams) {
    //      return res.status(200).json({
    //        payload: {},
    //        message: "game started"
    //      });
    //    });


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