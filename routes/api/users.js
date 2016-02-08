'use strict';
/*
	api definition for users
*/
var util = require('util');
var models = require('../../models');

var users = {
  all: function(req, res) {

    models.user.all().then(function(users) {
      return res.status(200).json({
        payload: users
      });
    }).catch(function() {
      return res.status(400).json({
        error: error,
        message: "api.users.get error"
      });
    });
  },

  // get user by id
  get: function(req, res) {

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

module.exports = users;