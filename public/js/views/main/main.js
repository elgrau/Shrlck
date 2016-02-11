'use strict';
define(['jquery', 'underscore', 'backbone', 'text!templates/main/main.ejs'], function ($, _, Backbone, mainTemplate) {
  var MainView = Backbone.View.extend({
    tagName: 'section',
    className: 'box light mainHome',
    events: {
      'click button[action="reset"]': 'reset',
      submit: 'requestClue'
    },
    initialize: function () {
      $('body').addClass('mainBackground');
      this.$el.html(_.template(mainTemplate, {}));
    },
    reset: function (e) {
      e.preventDefault();
      this.$('form').get(0).reset();
    },
    requestClue: function (e) {
      e.preventDefault();

      var data = _.object(_.map($('form').serializeArray(), _.values));

      $.ajax({
        type: 'POST',
        url: 'api/clue',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: data,
        beforeSend: function () {
          $('body').trigger('showNotificationModal', ['generic', 'Logging', "Validando pista..."]);
        },
        success: function (response) {
          console.log('Clue requested succesfuly.');
          $('body').trigger('showNotificationModal', ['Warning', 'success', "Pista solicitada"]);

          this.reset();
        },
        error: function (err) {
          console.log('Error solicitando la pista.');
          $('body').trigger('hideNotificationModal', 'Solicitando pista');
          if (!(err && err.responseJSON && err.responseJSON.message)) {
            //$('body').trigger('showNotificationModal', ['Warning', 'error', literals.loginError]);
          }
        }
      });
    }
  });
  return MainView;
});