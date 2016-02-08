'use strict';
/*
	api definition for teams
*/
var util = require('util');
var models = require('../../models');

var team = {
  all: function(req, res) {

    models.team.all().then(function(teams) {
      return res.status(200).json({
        payload: teams
      });
    }).catch(function() {
      return res.status(400).json({
        error: error,
        message: "api.team.all error"
      });
    });
  },

  // get user by id
  get: function(req, res) {
    var resourceFile = req.params.id;

    resourceLoader.file(resourceFile + '.html', 'clue').then(function(data) {

      var attachments = [];
      var image = resourceFile + '.png';
      var imagePath = 'resources/clue/' + image;

      if (resourceLoader.contains(image, 'clue')) {
        attachments = [{
          filename: image,
          path: imagePath,
          cid: 'image@shrlck'
        }];
      }

      emailSender.send("elgrau@gmail.com", "Pista " + req.params.id, data, attachments).then(function(response) {
        return res.status(200).json({
          payload: {},
          message: "success"
        });
      }).catch(function(error) {
        return res.status(400).json({
          error: "cannot send email",
          message: error
        });
      });
    }).catch(function(error) {
      return res.status(400).json({
        error: "clue not found",
        message: error
      });
    });
  },

  // create a user
  create: function(req, res) {

  },

  // update a user
  update: function(req, res) {

  },

  // get user by id
  delete: function(req, res) {

  }
}

module.exports = team;