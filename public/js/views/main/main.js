'use strict';
define([], function () {
    var MainHome = Backbone.View.extend({
        tagName: 'section',
        className: 'box light mainHome',
        events: {},
        initialize: function () {
            return this;
        },
        render: function () {
            this.$el.append('<div class="center"><h1>Hello World !! I\'m ACRIS !!</h1><a href="#test">GO TO TEST</a><br><a href="#poc">GO TO PoC</a><br><a href="#mock">GO TO MOCK</a></div><br><div id="content"></div>');
        }
    });
    return MainHome;
});