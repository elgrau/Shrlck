/**
 * Routes
 */
var express = require('express');
var passport = require('passport');
var router = express.Router();
var parse = require('parse/node').Parse;
var api = require('./api/index');

function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    // display an "already logged in" message
    return res.status(401).json({
      payload: {},
      message: "Unauthorize access"
    });
  }
  next();
}

function ensureUnauthenticated(req, res, next) {
  if (req.user) {
    // display an "already logged in" message
    return res.status(400).json({
      payload: {},
      message: "Invalid request"
    });
  }
  next();
}

//authentication
router.get('/me', api.auth.validateToken, ensureAuthenticated, api.auth.me);
router.post('/login', api.auth.validateToken, ensureUnauthenticated, api.auth.login);
router.post('/signup', api.auth.validateToken, ensureUnauthenticated, api.auth.signup);
router.get('/logout', api.auth.validateToken, ensureAuthenticated, api.auth.logout);

//api/users calls
router.get('/', api.default);
router.get('/users', api.auth.validateToken, ensureUnauthenticated, api.users.all);
router.get('/users/:id', api.auth.validateToken, ensureUnauthenticated, api.users.get);
router.put('/users/:id', api.auth.validateToken, ensureAuthenticated, api.users.update);
router.delete('/users/:id', api.auth.validateToken, ensureAuthenticated, api.users.delete);

//router.get('/messages', api.auth.validateToken, ensureUnauthenticated, api.messages.all);
//router.get('/messages/:id', api.auth.validateToken, ensureUnauthenticated, api.messages.getById);

router.get('/startgame', api.auth.validateToken, ensureUnauthenticated, api.game.start);
router.get('/clue/:id', api.auth.validateToken, ensureAuthenticated, api.clue.get);
router.get('/teams', api.auth.validateToken, ensureUnauthenticated, api.team.all);

//api error
router.get('/error', api.error);

module.exports = router;