'use strict';

var PouchModel = require('./PouchModel');
var inherits = require('util').inherits;

function User() {
  PouchModel.call(this, 'user');
};

inherits(User, PouchModel);

User.prototype.login = function(email, password) {
  var _database = User.super_.prototype.database.call(this);

  return new Promise(function(resolve, reject) {
    _database.get(email).then(function (user) {
      if (user.password === password) {
        return resolve(user);
      } else {
        return reject("Authentication failed");
      }
    }).catch(function (error) {
      reject(error);
    });
  });
}

User.prototype.signup = function(data) {
  return User.super_.prototype.put.call(this,data);
}


module.exports = User;