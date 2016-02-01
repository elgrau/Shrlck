'use strict';
/*
	api definition for users
*/
var util = require('util');

var passport = require('passport');
var moment = require('moment');
var _ = require('lodash');
var jwt = require('jwt-simple');

var config = require('../../config');
var db = require('../../models');
var database = require('../../modules/database');
var users = require('./users');

var createToken = function (user) {
  var expires = moment().add(30, 'days').valueOf();
  return jwt.encode({
    iss: user.identifier,
    exp: expires,
    parseSession: user._sessionToken
  }, config.session.secret);
}

var auth = {
  validateToken: function (req, res, next) {
    var token = req.params["x-access-token"] || req.query["x-access-token"] || req.headers["x-access-token"];

    if (token) {
      database.get('tokens', token).then(function (response) {

        if (!response) {
          return next();
        }

        var decoded = jwt.decode(response.identifier, config.session.secret);

        console.log(decoded);

        if (decoded.exp <= Date.now()) {
          response.destroy();
          return res.status(400).json({
            payload: {
              error: ''
            },
            message: 'Invalid Request'
          });
        }

        database.get('users', response.user).then(function (user) {
          req.user = user;
          return next();
        }).catch(function () {
          return next();
        });
      }).catch(function () {
        return next();
      });
    } else {
      next();
    }
  },

  me: function (req, res) {
    //check passport session for instagram twitter or local
    // use session value

    return res.json({
      payload: req.user,
      message: "ping successful"
    });
  },

  // registering a user
  register: function (req, res) {
    //var user = req.body.user;
    //console.log('auth.register');
    //// check user
    //if (!user) {
    //  //send bad request
    //  return res.status(500).json({
    //    payload: {},
    //    message: "Invalid request"
    //  });
    //}
    //
    //// check user fields
    //if (!user.username || !user.email || !user.password) {
    //  //send bad request
    //  return res.status(400).json({
    //    payload: {},
    //    message: "Missing credentials check all the fields then try again"
    //  });
    //}
    //
    //db.user.create(user).then(function(user) {
    //    //success when signing up, now we try to login
    //    res.status(200).json({
    //      payload: user,
    //      message: "Account successfully created"
    //    });
    //  },
    //  function(error) {
    //    res.status(400).json({
    //      payload: error.code,
    //      message: error.message
    //    });
    //  });
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

    //passport.authenticate('parse', function(err, user, info) {
    //  if (err) {
    //    return res.status(400).json({
    //      payload: {
    //        error: err
    //      },
    //      message: info.message
    //    });
    //  }
    //
    //  if (!user) {
    //    return res.status(400).json({
    //      payload: {
    //        error: err
    //      },
    //      message: info.message
    //    });
    //  }
    //
    //  _authTokenRequestCb(user, req, res);
    //
    //})(req, res);

    database.findBy('users', 'email', email).then(function (user) {
      if (!_.isEmpty(user) && user.password === password) {

        var tokenId = createToken(user);
        database.save('tokens', {
          "identifier": tokenId,
          "user": user.identifier
        }).then(function (token) {
          return res.status(200).json({
            payload: {
              user: user,
              token: tokenId
            },
            message: "Authentication successfull"
          });
        }).catch(function () {
          return res.status(400).json({
            payload: {},
            message: "Token creation failed"
          });
        });
      } else {
        return res.status(400).json({
          payload: {},
          message: "Authentication failed"
        });
      }
    });
  },

  logout: function (req, res) {
    //db.tokenRequest.delete(req.user, 'user').then(function() {
    //  db.user.Parse.User.logOut();
    //  res.json({
    //    payload: {},
    //    message: "logout message triggered"
    //  })
    //}, function(error) {
    //  res.json({
    //    payload: {},
    //    message: "Logout failed"
    //  });
    //});
  }
}

module.exports = auth;