'use strict';

var userModel = require('./user');
var teamModel = require('./team');
var database = require('../modules').database;
var resourceLoader = require('../modules').resourceLoader;
var mail = require('../modules').mail;
var _ = require('lodash');

function Game() {};

function createTeams(id, teams) {
  return database('games').chain().find({
    "id": id
  }).assign({
    'teams': teams
  }).value();
}

function sendCase(game) {

  return new Promise(function (resolve, reject) {
    var gamePath = 'game/' + game.id;
    resourceLoader.file('case.html', gamePath).then(function (data) {

      var attachments = [];
      var image = 'case.png';
      var imagePath = 'resources/game/' + image;

      if (resourceLoader.contains(image, gamePath)) {
        attachments = [{
          filename: image,
          path: imagePath,
          cid: 'image@shrlck'
        }];
      }

      if (!_.isEmpty(game.teams)) {

        for (var key in game.teams) {
          var team = game.teams[key];

          if (!_.isEmpty(team.users)) {
            var teamNames = userModel.userNames(team.users).join(", ");
            var body = data.replace("{team}", teamNames);
            var html = mail.createHtml(body);

            var to = team.users.join();

            mail.send(to, "Caso: " + game.title, html, attachments).then(function (response) {
              resolve();
            }).catch(function (error) {
              reject(error);
            });
          }
        }
      } else {
        reject('The game has no teams');
      }
    }).catch(function (error) {
      reject(error);
    });
  });
}

Game.prototype.get = function (criteria) {
  return database('games').find(criteria);
}

Game.prototype.start = function (id) {
  return new Promise(function (resolve, reject) {

    var game = Game.prototype.get.call(this, {
      "id": id
    });

    if (game) {
      var users = userModel.all();
      var teams = teamModel.createTeams(users, game.numberOfTeams);

      createTeams(id, teams).then(function () {
        sendCase(game).then(function () {
          resolve();
        }).catch(function (error) {
          console.log(error);
          reject(error);
        });
      }).catch(function (error) {
        reject(error);
      });
    } else {
      reject("game not found");
    }

  });
}

var game = new Game();

module.exports = game;