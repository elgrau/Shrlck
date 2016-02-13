'use strict';
define(['jquery', 'underscore', 'backbone', 'text!templates/main/main.ejs'], function($, _, Backbone, mainTemplate) {
  var MainView = Backbone.View.extend({
    tagName: 'section',
    className: 'box light mainHome',
    events: {
      'click button[action="reset"]': 'reset',
      submit: 'requestClue'
    },
    initialize: function() {
      $('body').addClass('mainBackground');
      this.$el.html(_.template(mainTemplate, {}));
    },
    reset: function(e) {
      e.preventDefault();
      this.$('form').get(0).reset();
    },
    requestClue: function(e) {
      e.preventDefault();

      var data = _.object(_.map($('form').serializeArray(), _.values));

      var message = $('.message');
      message.html('Investigando...');
      message.addClass('visible');

      var _self = this;
      $.ajax({
        type: 'POST',
        url: 'api/clue',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        success: function(response) {
          $('form').get(0).reset();

          var message = $('.message');
          message.html('Investigación completada. Revisa tu correo para leer el resultado de la investigación');

          window.setTimeout(function() {
            message.removeClass('visible');
          }, 5000);

        },
        error: function(err) {
          if (err && err.responseJSON && err.responseJSON.message) {
            var message = $('.message');
            message.html(err.responseJSON.message);

            window.setTimeout(function() {
              message.removeClass('visible');
            }, 5000);
          }
        }
      });
    }
  });
  return MainView;
});