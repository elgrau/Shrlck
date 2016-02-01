'use strict';
/*
	api definition for users
*/
var util = require('util');
var resourceLoader = require('../../modules/resourceLoader');
var emailSender = require('../../modules/mail/email');

var pistas = {
  // get pista by id
  get: function (req, res) {
    var resourceFile = req.params.id + '.html';

    resourceLoader.file(resourceFile, 'clue').then(function (data) {

      emailSender.send("elgrau@gmail.com", "Pista " + req.params.id, data).then(function (response) {
        return res.status(200).json({
          payload: {},
          message: "success"
        });
      }).catch(function (error) {
        console.error("Send email:" + error);
        return res.status(400).json({
          error: "cannot send email",
          message: error
        });
      });
    }).catch(function (error) {
      console.error("Resource file:" + error);
      return res.status(400).json({
        error: "clue not found",
        message: error
      });
    });
  }

}

module.exports = pistas;