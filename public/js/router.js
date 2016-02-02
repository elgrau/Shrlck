/* global literalsModel, literals, user, globalsModel, user, story */
'use strict';
define(['models/users/user', 'views/main/main'], function (UserModel, MainView) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      'test': 'testRoute',
      'dashBoard': 'dashBoard',
      'login': 'login',
      'logout': 'logout',
      '': 'defaultAction',
      // Default
      '*actions': 'defaultAction'
    },
    view: null,
    initialize: function () {
      this.listenTo(this, 'route', this.updateHistory);
      var _self = this;
      this.currentFragment = '';
      this.listenTo(this, 'route', function () {
        _self.currentFragment = Backbone.history.fragment;
      });
    },
    updateHistory: function (name) {

      story.push({
        name: name
      });

    },
    //execute: function(callback, args, name) {
    //  if (this.view && _.isFunction(this.view.isEditing) && this.view.isEditing() === true) {
    //    if (window.legacyConfirm(literals.loseYourChangesConfirm)) {
    //      AppRouter.__super__.execute.apply(this, arguments);
    //    } else {
    //
    //      this.navigate(this.currentFragment, {
    //        trigger: false
    //      });
    //      return false;
    //    }
    //  } else {
    //    AppRouter.__super__.execute.apply(this, arguments);
    //  }
    //},

    activateNav: function (e) {
      //$('a[href$="' + e + '"]').closest('li').addClass('active');
    },
    defaultAction: function () {
      this.view = null;
      this.dashBoard();
      this.activateNav('dashBoard');
    },
    dashBoardAccesed: function () {
      if (!_.isUndefined(window.user) && user.isLogged()) {
        this.defaultAction();
      } else {
        this.cleanDashboard();

        //window.location.href = globals.commonGatewayLoginURL;
      }
    },

    testRoute: function () {
      window.user.fetch({
        success: function (user) {
          console.log(user);
        },
        error: function () {
          console.log("error");
        }
      });

    },
    /**
     * the dashboard is the structure of the page, the menus, headers etc...
     */
    dashBoard: function () {
      this.cleanDashboard();

      if (_.isUndefined(window.user) || !user.isLogged()) {
        this.login();
      } else {
        var container = $('body').empty();
        //window.user.fetch({
        //  success: function() {},
        //  error: function() {}
        //});
        //console.log(window.user.username);

        this.mainView = new MainView({
          el: $('<section>').appendTo(container)
        });
        this.mainView.render();
      }

    },
    cleanDashboard: function () {
      if (this.mainView) {
        this.mainView.remove();
        this.mainView = null;
      }

      var container = $('body').empty();
    },

    login: function () {
      this.cleanDashboard();

      var container = $('body');
      require(['js/views/auth/login'], function (LoginView) {
        var loginView = new LoginView({
          el: $('<section>').appendTo(container)
        });
        loginView.render();
      });
    },
    /**
     * logout
     */
    logout: function () {
      if (_.isUndefined(window.user) || !user.isLogged()) {
        window.user.logout();
      }
    }
  });

  var initialize = function () {

    // We handle here the prefilter to add the security Tokens.
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
      var oldBeforeSend;
      if (!_.isUndefined(options.beforeSend)) {
        oldBeforeSend = options.beforeSend;
      }
      options.beforeSend = function (xhr) {
        xhr.withCredentials = true;
        if (oldBeforeSend) {
          oldBeforeSend(xhr);
        }
      };
      jqXHR.setRequestHeader('Cache-Control', 'no-cache');
      jqXHR.setRequestHeader('Pragma', 'no-cache');
      if (!_.isUndefined(window.app) && !_.isUndefined(window.app.headers) && window.app.headers) {
        _.each(window.app.headers, function (value, key) {
          jqXHR.setRequestHeader(key, value);
        });
      }
      return jqXHR;
    });

    $(document).ajaxError(function (event, response, settings) {
      if (!/abort|cancel|timeout/i.test(response.statusText)) {
        $(document).trigger('handleError', [response, settings, event]);
      }
    });
    window.app = window.app || {};
    window.app.headers = window.app.headers || {};

    //var oldAjax = $.ajax;
    //$.ajax = function(url, options) {
    //  if (typeof url === 'object') {
    //    options = url;
    //    url = undefined;
    //  }
    //  options = options || {};
    //  var oldSuccess = options.success;
    //  options.success = function(data, textStatus, jqXHR) {
    //    /* HEADERS TREATMENT */
    //    var csrfName = jqXHR.getResponseHeader('x-access-token');
    //    console.log('hola' + csrfName);
    //    if (csrfName) {
    //      var csrfValue = jqXHR.getResponseHeader(csrfName);
    //      window.app.headers[csrfName] = csrfValue;
    //    }
    //    /* END HEADERS TREATMENT */
    //    if (oldSuccess) {
    //      oldSuccess(data, textStatus, jqXHR);
    //    }
    //  };
    //  return oldAjax.apply($, [url, options]);
    //};
    $(document).ajaxSuccess(function (event, response, settings) {});
    window.enableAsynchronousCommunications = false;
    if (!/callback/i.test(window.location.href)) {
      var initRouter = function () {
        window.story = [];
        window.appRouter = new AppRouter();
        Backbone.history.start({
          pushState: false
        });
      };

      var waitRequests = 1;
      var callback = function () {
        waitRequests--;
        if (waitRequests <= 0) {
          initRouter();
        }
      };

      var user = new UserModel();
      user.fetch({
        success: function () {
          window.user = user;
          callback();
        },
        error: callback
      });

      //window.user = new UserModel();
      //window.user.fetch({
      //    success: function () {
      //        console.log("usuario leído");
      //    },
      //    error: function () {
      //        console.error("error obteniendo usuario");
      //    }
      //});

      $(window).bind('beforenload', function (e) {});
      $(window).on('unload', function (e) {});

    } else {
      window.appRouter = new AppRouter();
      Backbone.history.start({
        pushState: false
      });
    }
  };
  return {
    initialize: initialize
  };
});