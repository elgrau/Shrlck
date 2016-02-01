/* global app */
'use strict';
var path = require('path');
var fs = require('fs');
var resourcesPath = path.join(__dirname, '../resources');

function ResourceLoader() {}

ResourceLoader.prototype = {

  resources: function (type) {
    var tmp = resourcesPath;

    if (type != null) {
      tmp = path.join(tmp, type);
    }

    return fs.readdirSync(tmp);
  },

  resource: function (name, type) {
    var resourceFile = this.resourcePath(name, type);

    if (fs.existsSync(resourceFile)) {
      var data = require(resourceFile);

      if (_.isFunction(data)) {
        return data;
      } else {
        return _.clone(data);
      }
    } else {
      return null;
    }
  },

  file: function (name, type) {
    var resourceFile = this.resourcePath(name, type);

    return new Promise(function (resolve, reject) {
      fs.readFile(resourceFile, 'utf8', function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },

  resourcePath: function (name, type) {
    var resourceFile = resourcesPath;

    if (type != undefined) {
      resourceFile = path.resolve(path.join(resourceFile, type));
    }

    return path.resolve(path.join(resourceFile, name));
  },

  contains: function (name, type) {
    return fs.existsSync(this.resourcePath(name, type));
  }

}

// Default instance
var resourceLoader = new ResourceLoader();

module.exports = resourceLoader;