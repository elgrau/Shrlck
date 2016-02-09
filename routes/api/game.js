'use strict';
/*
	api definition for users
*/
var models = require('../../models');

var game = {

    start: function (req, res) {

        var users = models.user.all();
        models.team.createTeams(users, 2).then(function (teams) {

            var team = models.team.findByUser("elgrau@gmail.com");
            console.log(team);

            return res.status(200).json({
                payload: teams,
                message: "game started"
            });
        }).catch(function (error) {
            return res.status(400).json({
                error: error,
                message: "game not started."
            });
        });
    }
}

module.exports = game;