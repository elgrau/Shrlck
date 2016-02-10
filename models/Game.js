'use strict';

var userModel = require('./User');
var teamModel = require('./Team');
var database = require('../modules').database;
var resourceLoader = require('../modules').resourceLoader;
var mail = require('../modules').mail;
var _ = require('lodash');

function Game() {};

function findTeam(game, email) {
  var team = _.find(game.teams, function (value) {
    return _.contains(value.users, email);
  });
  return team;
}

function saveTeams(gameId, teams) {
  return database('games').chain().find({
    "id": gameId
  }).assign({
    'teams': teams
  }).value();
}

function setStatus(gameId, status) {
  return database('games').chain().find({
    "id": gameId
  }).assign({
    'status': status
  }).value();
}

function addClueRequest(game, team, email, clue) {

  if (!team.clues) {
    team.clues = [];
  }
  team.clues.push({
    "clue": clue,
    "email": email
  });

  return database('games').chain().find({
    "id": game.id
  }).assign(game).value();
}

function getAttachments(image, path) {
  var attachments = [];
  var imagePath = 'resources/' + path + '/' + image;

  if (resourceLoader.contains(image, path)) {
    attachments = [{
      filename: image,
      path: imagePath,
      cid: 'image@shrlck'
    }];
  }
  return attachments;
}

function sendCase(game) {

  return new Promise(function (resolve, reject) {

    if (!_.isEmpty(game.teams)) {
      var gamePath = 'game/' + game.id;
      resourceLoader.file('case.html', gamePath).then(function (data) {

        var attachments = getAttachments('case.png', 'game/' + game.id);

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
      }).catch(function (error) {
        reject(error);
      });
    } else {
      reject('The game has no teams');
    }

  });
}

function sendClue(game, clue, team, email) {
  return new Promise(function (resolve, reject) {
    var cluePath = 'game/' + game.id + '/clues';
    resourceLoader.file(clue + '.html', cluePath).then(function (data) {

      var attachments = getAttachments(clue + '.png', 'game/' + game.id + '/clues');
      var html = mail.createHtml(data);
      var to = team.users.join();

      addClueRequest(game, team, email, clue).then(function () {
        resolve();
        //        mail.send(to, "Pista: " + clue, html, attachments).then(function (response) {
        //          resolve();
        //        }).catch(function (error) {
        //          reject(error);
        //        });
      }).catch(function (error) {
        reject(error);
      })

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
      if (game.status === 'not started') {
        var users = userModel.all();
        var teams = teamModel.createTeams(users, game.numberOfTeams);

        saveTeams(id, teams).then(function () {
          sendCase(game).then(function () {

            setStatus(id, 'started').then(function () {
              resolve();
            }).catch(function (error) {
              reject(error);
            });
          }).catch(function (error) {
            reject(error);
          });
        }).catch(function (error) {
          reject(error);
        });
      } else {
        reject("game already started");
      }
    } else {
      reject("game not found");
    }
  });
}

Game.prototype.requestClue = function (email, clue) {
  return new Promise(function (resolve, reject) {

    var game = Game.prototype.get.call(this, {
      "status": 'started'
    });
    if (game) {
      var team = findTeam(game, email);
      if (team) {
        sendClue(game, clue, team, email).then(function () {

          resolve();
        }).catch(function (error) {
          reject(error);
        })
      }
    } else {
      reject("game not started");
    }
  });
}

var game = new Game();

module.exports = game;