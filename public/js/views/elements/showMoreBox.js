'use strict';
define(['jquery', 'underscore', 'backbone', 'text!templates/elements/showMoreBox.ejs'], function ($, _, Backbone, showMoreBoxTemplate) {
    var showMoreBox = Backbone.View.extend({
        tagName: 'section',
        className: 'box light showMoreBox',
        events: {},
        initialize: function () {
            return this;
        },
        render: function () {
            this.$el.append(_.template(showMoreBoxTemplate, {}));
        }
    });
    return showMoreBox;
});
