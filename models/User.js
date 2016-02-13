'use strict';

var database = require('../modules').database;

function User() {};

User.prototype.all = function() {
  return database.object.users;
}

User.prototype.get = function(criteria) {
  return database('users').find(criteria);
}

User.prototype.save = function(data) {

  return new Promise(function(resolve, reject) {
    var user = {};
    user.email = data.email || undefined;
    user.username = data.username || '';
    user.password = data.password || '';

    if (user.email === undefined) {
      reject('Email not provided');
    } else {
      var userdb = undefined;
      var users = database('users');

      if (users != undefined) {
        userdb = database('users').find({
          "email": user.email
        });
      }
      if (userdb) {
        database('users').chain().find({
          "email": user.email
        }).assign(user).value().then(function(value) {
          resolve(value)
        }).catch(function(error) {
          reject(error)
        });
      } else {
        database('users').push(user).then(function(value) {
          resolve(user)
        }).catch(function(error) {
          reject(error)
        });
      }
    }
  });
}

User.prototype.userNames = function(users) {
  var usernames = [];

  if (users.length > 0) {
    for (var key in users) {
      var email = users[key];

      var user = User.prototype.get.call(this, {
        "email": email
      });

      if (user) {
        usernames.push(user.username);
      }
    }
  }
  return usernames;
}

var user = new User();

module.exports = user;