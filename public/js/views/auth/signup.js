/* global appRouter, literals */
'use strict';
define(['jquery', 'underscore', 'backbone', 'models/users/user', 'text!templates/auth/signup.ejs'], function($, _, Backbone, UserModel, signupTemplate) {
  var SignupView = Backbone.View.extend({
    events: {
      'click button[action="reset"]': 'reset',
      submit: 'signup'
    },
    initialize: function() {
      $('body').addClass('loginBackground');
      this.$el.html(_.template(signupTemplate, {}));
    },
    reset: function(e) {
      e.preventDefault();
      this.$('form').get(0).reset();
    },
    signup: function(e) {
      e.preventDefault();

      var data = _.object(_.map($('form').serializeArray(), _.values));
      data.password = CryptoJS.MD5(data.password).toString();

      $.ajax({
        type: 'POST',
        url: 'api/signup',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function(response) {
          window.user = new UserModel(_.extend({}, response.payload.user));

          appRouter.navigate('dashBoard', true);
        },
        error: function(err) {
          if (err && err.responseJSON && err.responseJSON.message) {
            var message = $('.message');
            message.html(err.responseJSON.message);
            message.addClass('visible');

            window.setTimeout(function() {
              message.removeClass('visible');
            }, 5000);
          }
        }
      });
    }
  });
  return SignupView;
});