'use strict';

var userModel = require('./User');
var teamModel = require('./Team');
var database = require('../modules').database;
var resourceLoader = require('../modules').resourceLoader;
var mail = require('../modules').mail;
var _ = require('lodash');

function Game() {};

function findTeam(game, email) {
  var team = _.find(game.teams, function(value) {
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

function sendEmail(to, subject, body, attachments) {
  //return new Promise(function(resolve, reject) {
  //  resolve();
  //});
  return mail.send(to, subject, body, attachments);
}

function sendCase(game) {

  return new Promise(function(resolve, reject) {

    if (!_.isEmpty(game.teams)) {
      var gamePath = 'game/' + game.id;
      resourceLoader.file('case.html', gamePath).then(function(data) {

        var attachments = getAttachments('case.png', 'game/' + game.id);

        for (var key in game.teams) {
          var team = game.teams[key];

          if (!_.isEmpty(team.users)) {
            var teamNames = userModel.userNames(team.users).join(", ");
            var body = data.replace("{team}", teamNames);
            var html = mail.createHtml(body);

            var to = team.users.join();

            sendEmail(to, "Caso: " + game.title, html, attachments).then(function() {
              resolve();
            }).catch(function(error) {
              reject(error);
            });
          }
        }
      }).catch(function(error) {
        reject(error);
      });
    } else {
      reject('El juego no tiene equipos');
    }

  });
}

function sendClue(game, clue, team, email) {
  return new Promise(function(resolve, reject) {

    var clueFile = clue;
    if (!existsClue(game, clue)) {
      clueFile = 'default';
    }

    var cluePath = 'game/' + game.id + '/clues';
    resourceLoader.file(clueFile + '.html', cluePath).then(function(data) {

      var attachments = getAttachments(clueFile + '.png', 'game/' + game.id + '/clues');
      var html = mail.createHtml(data.replace("{clue}", clue));
      var to = team.users.join();

      sendEmail(to, "Caso: " + game.title, html, attachments).then(function() {
        addClueRequest(game, team, email, clue).then(function() {
          resolve();
        }).catch(function(error) {
          reject(error);
        });
      }).catch(function(error) {
        reject(error);
      });
    }).catch(function(error) {
      reject(error);
    });
  });
}

function existsClue(game, clue) {
  var cluePath = 'game/' + game.id + '/clues';
  return resourceLoader.contains(clue + '.html', cluePath);
}

function isValidClue(team, clue) {
  if (!_.isUndefined(team.clues)) {
    return !_.some(team.clues, {
      "clue": clue
    });
  }
  return true;
}

Game.prototype.get = function(criteria) {
  return database('games').find(criteria);
}

Game.prototype.start = function(id) {
  return new Promise(function(resolve, reject) {

    var game = Game.prototype.get.call(this, {
      "id": id
    });

    
    if (game) {
      if (game.status === 'not started') {
        var users = userModel.all();
        var teams = teamModel.createTeams(users, game.numberOfTeams);

        saveTeams(id, teams).then(function() {          
          
          sendCase(game).then(function() {

            setStatus(id, 'started').then(function() {
              resolve();
            }).catch(function(error) {
              reject(error);
            });
          }).catch(function(error) {
            reject(error);
          });
        }).catch(function(error) {
          console.log('hello');
          reject(error);
        });
      } else {
        reject("El juego ya se encuentra iniciado");
      }
    } else {
      reject("Juego no encontrado");
    }
  });
}

Game.prototype.requestClue = function(email, clue) {
  return new Promise(function(resolve, reject) {

    var game = Game.prototype.get.call(this, {
      "status": 'started'
    });
    if (game) {
      var team = findTeam(game, email);
      if (team) {

        var clueCode = clue.toUpperCase();
        if (isValidClue(team, clueCode)) {
          sendClue(game, clueCode, team, email).then(function() {
            resolve();
          }).catch(function(error) {
            reject(error);
          });
        } else {
          reject("Ya has investigado ese lugar");
        }
      } else {
        reject("El usuario no pertenece a ningún equipo");
      }
    } else {
      reject("El juego no ha comenzado todavía");
    }
  });
}

var game = new Game();

module.exports = game;