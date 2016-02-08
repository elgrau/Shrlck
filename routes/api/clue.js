'use strict';
/*
	api definition for users
*/
var util = require('util');
var resourceLoader = require('../../modules/resourceLoader');
var emailSender = require('../../modules/mail/email');
var models = require('../../models');

var clue = {
  // get pista by id
  get: function(req, res) {

    var user = req.session.user;
    var team = models.team.findByUser(user.id);

    console.log(team);

    return res.status(200).json({
      payload: {},
      message: "success"
    });


    //    var resourceFile = req.params.id;
    //
    //    resourceLoader.file(resourceFile + '.html', 'clue').then(function(data) {
    //
    //      var attachments = [];
    //      var image = resourceFile + '.png';
    //      var imagePath = 'resources/clue/' + image;
    //
    //      if (resourceLoader.contains(image, 'clue')) {
    //        attachments = [{
    //          filename: image,
    //          path: imagePath,
    //          cid: 'image@shrlck'
    //        }];
    //      }
    //
    //      emailSender.send("elgrau@gmail.com", "Pista " + req.params.id, data, attachments).then(function(response) {
    //        return res.status(200).json({
    //          payload: {},
    //          message: "success"
    //        });
    //      }).catch(function(error) {
    //        return res.status(400).json({
    //          error: "cannot send email",
    //          message: error
    //        });
    //      });
    //    }).catch(function(error) {
    //      return res.status(400).json({
    //        error: "clue not found",
    //        message: error
    //      });
    //    });
    //  }

  }
}

module.exports = clue;