/**
 * Routes
 */
var express = require('express');
var router = express.Router();
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

router.get('/startgame/:id', api.auth.validateToken, ensureUnauthenticated, api.game.start);
router.post('/clue', api.auth.validateToken, ensureAuthenticated, api.game.requestClue);

//api error
router.get('/error', api.error);

module.exports = router;