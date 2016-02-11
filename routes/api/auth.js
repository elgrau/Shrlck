'use strict';
/*
	api definition for users
*/
var util = require('util');

var moment = require('moment');
var _ = require('lodash');
var jwt = require('jwt-simple');
var validator = require("validator");

var config = require('../../config');
var modules = require('../../modules');
var model = require('../../models');

var users = require('./users');

var auth = {
  validateToken: function (req, res, next) {
    if (req.session.user) {
      req.user = req.session.user;
      return next();
    } else {
      return next();
    }
  },

  me: function (req, res) {
    return res.json({
      payload: req.user,
      message: "ping successful"
    });
  },

  // registering a user
  signup: function (req, res) {
    var username = (req.body.username !== undefined) ? req.body.username : false;
    var email = (req.body.email !== undefined) ? req.body.email : false;
    var password = (req.body.password !== undefined) ? req.body.password : false;

    if (!username || !email || !password) {
      //send bad request
      return res.status(400).json({
        error: "Missing fields",
        message: "SignUp not completed"
      });
    } else if (!validator.isEmail(email)) {
      return res.status(400).json({
        error: "Email not valid",
        message: "SignUp not completed"
      });
    }

    model.user.save({
      "username": username,
      "email": email,
      "password": password
    }).then(function (user) {
      var session = req.session;
      session.user = user;

      return res.status(200).json({
        payload: {
          user: user
        },
        message: "Registration successfull"
      });
    }).catch(function (error) {
      return res.status(400).json({
        error: "" + error,
        message: "User cannot be registered"
      });
    });

  },
  // login a user
  login: function (req, res) {
    var email = (req.body.email !== undefined) ? req.body.email : false;
    var password = (req.body.password !== undefined) ? req.body.password : false;

    if (!email || !password) {
      //send bad request
      return res.status(400).json({
        payload: {},
        message: "Invalid email or password"
      });
    }

    var user = model.user.get({
      "email": email
    });

    if (user) {
      var session = req.session;
      session.user = user;

      return res.status(200).json({
        payload: {
          user: user
        },
        message: "Authentication successfull"
      });
    } else {
      return res.status(400).json({
        payload: {},
        message: "Authentication failed"
      });
    }
  },

  logout: function (req, res) {
    if (req.session.user) {
      delete req.session["user"];
    }

    req.session.destroy(function (err) {

      return res.status(200).json({
        payload: {},
        message: "Logged out"
      });
    });
  }
}

module.exports = auth;