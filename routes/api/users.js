'use strict';
/*
	api definition for users
*/
var util = require('util');
var database = require('../../modules/database');

var users = {
  all: function(req, res) {
    database.all('users').then(function(users) {
      return res.status(200).json({
        payload: users,
        message: "api.users.get success"
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