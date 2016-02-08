'use strict';
/*
	api definition for users
*/
var util = require('util');

var passport = require('passport');
var moment = require('moment');
var _ = require('lodash');
var jwt = require('jwt-simple');
var validator = require("validator");

var config = require('../../config');

var models = require('../../models');


var createToken = function(user) {
  var expires = moment().add(30, 'days').valueOf();
  return jwt.encode({
    iss: user.identifier,
    exp: expires,
    parseSession: user._sessionToken
  }, config.session.secret);
}

var auth = {
  validateToken: function(req, res, next) {
    if (req.session.user) {
      req.user = req.session.user;
      return next();
    } else {
      return next();
    }

    //    var token = req.params["x-access-token"] || req.query["x-access-token"] || req.headers["x-access-token"];
    //
    //    if (token) {
    //      database.get('tokens', token).then(function (response) {
    //
    //        if (!response) {
    //          return next();
    //        }
    //
    //        var decoded = jwt.decode(response.identifier, config.session.secret);
    //
    //        console.log(decoded);
    //
    //        if (decoded.exp <= Date.now()) {
    //          response.destroy();
    //          return res.status(400).json({
    //            payload: {
    //              error: ''
    //            },
    //            message: 'Invalid Request'
    //          });
    //        }
    //
    //        database.get('users', response.user).then(function (user) {
    //          req.user = user;
    //          return next();
    //        }).catch(function () {
    //          return next();
    //        });
    //      }).catch(function () {
    //        return next();
    //      });
    //    } else {
    //      next();
    //    }
  },

  me: function(req, res) {
    //check passport session for instagram twitter or local
    // use session value

    return res.json({
      payload: req.user,
      message: "ping successful"
    });
  },

  // registering a user
  signup: function(req, res) {
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

    models.user.signup({
      "_id": email,
      "username": username,
      "password": password
    }).then(function(user) {
      var session = req.session;
      session.user = user;

      return res.status(200).json({
        payload: user,
        message: "Registration successfull"
      });
    }).catch(function(error) {
      return res.status(400).json({
        error: "" + error,
        message: "User cannot be registered"
      });
    });
  },
  // login a user
  login: function(req, res) {
    var email = (req.body.email !== undefined) ? req.body.email : false;
    var password = (req.body.password !== undefined) ? req.body.password : false;

    if (!email || !password) {
      //send bad request
      return res.status(400).json({
        payload: {},
        message: "Invalid email or password"
      });
    }

    models.user.login(email, password).then(function(user) {
      var session = req.session;
      session.user = user;

      return res.status(200).json({
        payload: user,
        message: "Authentication successfull"
      });
    }).catch(function(error) {
      return res.status(400).json({
        error: "" + error,
        message: "Authentication failed"
      });
    });
  },

  logout: function(req, res) {
    if (req.session.user) {
      delete req.session["user"];
    }

    req.session.destroy(function(err) {

      return res.status(200).json({
        payload: {},
        message: "Logged out"
      });
    });
  }
}

module.exports = auth;