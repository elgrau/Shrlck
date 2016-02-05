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
var db = require('../../models');
var database = require('../../modules/database');
var users = require('./users');

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

    database.findBy('users', 'email', email).then(function(user) {

      if (!_.isEmpty(user)) {

        return res.status(400).json({
          payload: {},
          message: "Email already exists"
        });
      } else {

        user = {
          "username": username,
          "email": email,
          "password": password
        };

        database.save('users', user).then(function(userSaved) {
          database.commit();

          delete userSaved["password"];
          var session = req.session;
          session.user = userSaved;

          var userData = _.clone(userSaved);
          delete userData["password"];

          return res.status(200).json({
            payload: {
              user: userData
            },
            message: "Registration successfull"
          });

        }).catch(function() {
          return res.status(400).json({
            payload: {},
            message: "User cannot be registered"
          });
        });
      }
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

    database.findBy('users', 'email', email).then(function(user) {
      if (!_.isEmpty(user) && user.password === password) {


        var session = req.session;
        session.user = user;

        var userData = _.clone(user);
        delete userData["password"];

        return res.status(200).json({
          payload: {
            user: userData
          },
          message: "Authentication successfull"
        });
      } else {
        return res.status(400).json({
          payload: {},
          message: "Authentication failed"
        });
      }
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