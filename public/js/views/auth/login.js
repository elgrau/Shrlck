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
      this.loadBackgroundImages();
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
          window.user = new UserModel(_.extend({}, response.payload.user));

          appRouter.navigate('dashBoard', true);

        },
        error: function(err) {
          console.log('Logged error.');
          $('body').trigger('hideNotificationModal', 'Logging');
          if (!(err && err.responseJSON && err.responseJSON.message)) {
            //$('body').trigger('showNotificationModal', ['Warning', 'error', literals.loginError]);
          }
        }
      });
    },
    loadBackgroundImages: function() {
      // canUse
      window.canUse = function(p) {
        if (!window._canUse) window._canUse = document.createElement("div");
        var e = window._canUse.style,
          up = p.charAt(0).toUpperCase() + p.slice(1);
        return p in e || "Moz" + up in e || "Webkit" + up in e || "O" + up in e || "ms" + up in e
      };

      // Settings.
      var settings = {

        // Images (in the format of 'url': 'alignment').
        images: {
          'style/images/bg01.jpg': 'center',
          'style/images/bg02.jpg': 'center',
          'style/images/bg03.jpg': 'center'
        },

        // Delay.
        delay: 6000
      };

      // Vars.
      var pos = 0,
        lastPos = 0,
        bgs = [],
        k, v;

      // Create BG wrapper, BGs.
      $('body').append('<div id="bg"></div>');

      for (k in settings.images) {

        // Create BG.
        var bg = $('<div></div>').css({
          'backgroundImage': 'url("' + k + '")',
          'backgroundPosition': settings.images[k]
        });
        bg.appendTo('#bg')

        // Add it to array.
        bgs.push(bg);

      }

      // Main loop.
      bgs[pos].addClass('visible');
      bgs[pos].addClass('top');

      // Bail if we only have a single BG or the client doesn't support transitions.
      if (bgs.length == 1 || !canUse('transition'))
        return;

      window.setInterval(function() {

        lastPos = pos;
        pos++;

        // Wrap to beginning if necessary.
        if (pos >= bgs.length)
          pos = 0;

        // Swap top images.
        bgs[lastPos].removeClass('top');
        bgs[pos].addClass('visible');
        bgs[pos].addClass('top');

        // Hide last image after a short delay.
        window.setTimeout(function() {
          bgs[lastPos].removeClass('visible');
        }, settings.delay / 2);

      }, settings.delay);
    }
  });
  return LoginView;
});