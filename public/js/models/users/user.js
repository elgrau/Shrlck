'use strict';
define([], function () {
  /**
   * This model is the current user logged
   * @name Models.User
   * @constructor
   * @extends Backbone.Model
   * @param {Object} attributes Attributes of the user.
   */
  var User = Backbone.HAL.Model.extend( /** @lends Models.User.prototype **/ {
    defaults: {
      username: '',
      email: ''
    },
    initialize: function (attributes) {
      this.logged = false;
      this.bind('change', function () {
        this.save();
      });
      if (!_.isUndefined(attributes) /*&& !_.isUndefined(attributes.token) && attributes.token*/ ) {
        //this.token = attributes.token;
        this.set(attributes);
        this.loggedSuccess();
        this.save();
      }
    },
    /**
     * Gets the URL to get the resource
     * @param  {Object}
     */
    url: function () {
      return 'api/me';
    },
    /**
     * Fetch the resource from backend.
     * If the fetch is successful the user will be logged in.
     * @param  {Object}
     */
    fetch: function (options) {
      var _self = this;
      $.ajax({
        method: 'GET',
        url: this.url(),
        success: function (userData) {
          if (!_.isUndefined(userData)) {
            _self.set(userData.payload.user);

            if (!_.isUndefined(options.success)) {
              options.success(_self);
            }
          } else {
            if (!_.isUndefined(options.success)) {
              options.success(_self);
            }
          }
        },
        error: function (err) {
          if (!_.isUndefined(options.error)) {
            options.error(_self);
          }
        }
      });
    },

    /**
     * Save does noop
     * @param  {Object}
     */
    save: function () {
      return true;
    },
    /**
     * Get if the user is logged or not
     * @return {Boolean} logged
     */
    isLogged: function () {
      return this.logged;
    },
    paramReplace: function (name, string, value) {
      var re = new RegExp('[\\?&]' + name + '=([^&#]*)'),
        delimeter = re.exec(string)[0].charAt(0),
        newString = string.replace(re, delimeter + name + '=' + value);

      return newString;
    },

    /**
     * Get if the user is logged or not
     * @return {Boolean} logged
     */
    loggedSuccess: function () {
      var _self = this;
      this.logged = true;

      //$(document).ajaxSend(function(e, xhr, options) {
      //  xhr.setRequestHeader('x-access-token', _self.get('token'));
      //});

      this.trigger('loggedSuccess');
    },
    logout: function () {
      //window.inboxStatus = null;
      //this.clear();
      this.logged = false;
      delete window.user;
      window.location.href = 'localhost:3000';
    },
    hasType: function (type) {
      return type === this.get('userType').key.toUpperCase();
    },
    /**
     * Checks whether the user has a specific role.
     * @return {Array} roles
     */
    hasRole: function (role) {
      return role === this.get('roleType').key.toUpperCase();
    },
    /**
     * Checks if an user is Admin
     */
    isAdmin: function () {
      return this.hasType(this.constructor.types.ADMIN);
    }
  }, {
    roles: {
      'ADMINISTRATOR': 'ROLE_ADMINISTRATOR',
      'USER': 'ROLE_USER'
    },
    types: {
      'ADMIN': 'ADMIN',
      'USER': 'USER'
    }
  });
  return User;
});