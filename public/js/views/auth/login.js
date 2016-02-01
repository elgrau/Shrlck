/* global appRouter, literals */
'use strict';
define(['jquery', 'underscore', 'backbone', 'models/users/user', 'text!templates/auth/login.ejs'], function($, _, Backbone, UserModel, loginTemplate) {
  var LoginView = Backbone.View.extend({
    events: {
      'click button[action="reset"]': 'reset',
      submit: 'login'
    },
    initialize: function() {
      $('body').addClass('loginBackground');
      this.$el.html(_.template(loginTemplate, {}));
    },
    reset: function(e) {
      e.preventDefault();
      this.$('form').get(0).reset();
    },
    login: function(e) {
      e.preventDefault();

      var data = _.object(_.map($('form').serializeArray(), _.values));

      $.ajax({
        type: 'POST',
        url: 'api/login',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        beforeSend: function() {
          $('body').trigger('showNotificationModal', ['generic', 'Logging', "Validando usuario..."]);
        },
        success: function(response) {
          console.log('Logged succesfuly.');
          $('body').trigger('showNotificationModal', ['Warning', 'success', "Acceso aceptado"]);
          window.app.headers['x-access-token'] = response.payload.token;
          window.user = new UserModel(_.extend({}, response.payload.user));

          $('body').trigger('hideNotificationModal', 'Logging');
          appRouter.navigate('dashBoard', true);

        },
        error: function(err) {
          console.log('Logged error.');
          $('body').trigger('hideNotificationModal', 'Logging');
          if (!(err && err.responseJSON && err.responseJSON.message)) {
            $('body').trigger('showNotificationModal', ['Warning', 'error', literals.loginError]);
          }
        }
      });
    }
  });
  return LoginView;
});