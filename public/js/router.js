/* global literalsModel, literals, user, globalsModel, user, story */
'use strict';
define(['models/users/user'], function(UserModel) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      'test': 'testRoute',
      'dashBoard': 'dashBoard',
      'signup': 'signup',
      'login': 'login',
      'logout': 'logout',
      '': 'defaultAction',
      // Default
      '*actions': 'defaultAction'
    },
    view: null,
    initialize: function() {
      this.listenTo(this, 'route', this.updateHistory);
      var _self = this;
      this.currentFragment = '';
      this.listenTo(this, 'route', function() {
        _self.currentFragment = Backbone.history.fragment;
      });
      this.loadBackgroundImages();
    },
    updateHistory: function(name) {

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

    activateNav: function(e) {
      //$('a[href$="' + e + '"]').closest('li').addClass('active');
    },
    defaultAction: function() {
      this.view = null;
      this.dashBoard();
      this.activateNav('dashBoard');
    },
    dashBoardAccesed: function() {
      if (!_.isUndefined(window.user) && user.isLogged()) {
        this.defaultAction();
      } else {
        this.cleanDashboard();

        //window.location.href = globals.commonGatewayLoginURL;
      }
    },

    testRoute: function() {
      window.user.fetch({
        success: function(user) {
          console.log(user);
        },
        error: function() {
          console.log("error");
        }
      });

    },
    /**
     * the dashboard is the structure of the page, the menus, headers etc...
     */
    dashBoard: function() {
      this.cleanDashboard();

      if (_.isUndefined(window.user) || !user.isLogged()) {
        this.login();
      } else {

        this.cleanDashboard();

        var container = $('#content');
        require(['js/views/main/main'], function(MainView) {
          var mainView = new MainView({
            el: $('<section>').appendTo(container)
          });
          mainView.render();
        });
      }
    },
    cleanDashboard: function() {
      if (this.mainView) {
        this.mainView.remove();
        this.mainView = null;
      }

      var container = $('#content').empty();
    },

    signup: function() {
      this.cleanDashboard();

      var container = $('#content');
      require(['js/views/auth/signup'], function(SignupView) {
        var signupView = new SignupView({
          el: $('<section>').appendTo(container)
        });
        signupView.render();
      });
    },

    login: function() {
      this.cleanDashboard();

      var container = $('#content');
      require(['js/views/auth/login'], function(LoginView) {
        var loginView = new LoginView({
          el: $('<section>').appendTo(container)
        });
        loginView.render();
      });
    },
    /**
     * logout
     */
    logout: function() {
      if (!_.isUndefined(window.user) && user.isLogged()) {
        window.user.logout();
        delete window.user;
      }
      window.location.href = '#';
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

  var initialize = function() {

    // We handle here the prefilter to add the security Tokens.
    $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
      var oldBeforeSend;
      if (!_.isUndefined(options.beforeSend)) {
        oldBeforeSend = options.beforeSend;
      }
      options.beforeSend = function(xhr) {
        xhr.withCredentials = true;
        if (oldBeforeSend) {
          oldBeforeSend(xhr);
        }
      };
      jqXHR.setRequestHeader('Cache-Control', 'no-cache');
      jqXHR.setRequestHeader('Pragma', 'no-cache');
      if (!_.isUndefined(window.app) && !_.isUndefined(window.app.headers) && window.app.headers) {
        _.each(window.app.headers, function(value, key) {
          jqXHR.setRequestHeader(key, value);
        });
      }
      return jqXHR;
    });

    $(document).ajaxError(function(event, response, settings) {
      if (!/abort|cancel|timeout/i.test(response.statusText)) {
        $(document).trigger('handleError', [response, settings, event]);
      }
    });
    window.app = window.app || {};
    window.app.headers = window.app.headers || {};


    $(document).ajaxSuccess(function(event, response, settings) {});
    window.enableAsynchronousCommunications = false;
    if (!/callback/i.test(window.location.href)) {
      var initRouter = function() {
        window.story = [];
        window.appRouter = new AppRouter();
        Backbone.history.start({
          pushState: false
        });
      };

      var waitRequests = 1;
      var callback = function() {
        waitRequests--;
        if (waitRequests <= 0) {
          initRouter();
        }
      };

      var user = new UserModel();
      user.fetch({
        success: function() {
          window.user = user;
          callback();
        },
        error: callback
      });

      $(window).bind('beforenload', function(e) {});
      $(window).on('unload', function(e) {});

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