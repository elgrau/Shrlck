'use strict';

var util = require('util');
var express = require('express');

exports.users = require('./users');
exports.auth = require('./auth');
exports.clue = require('./clue');
exports.game = require('./game');
exports.team = require('./team');

exports.default = function(req, res) {
  return res.json({
    message: "default"
  });
}

exports.error = function(req, res) {
  return res.status(500).json({
    payload: req,
    message: "an error occured"
  });
}