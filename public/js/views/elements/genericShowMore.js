'use strict';
define(['jquery', 'underscore', 'backbone'], function ($, _, Backbone) {
    var genericShowMore = Backbone.View.extend({
        events: {
            'click .showMore': 'showMore',
            'click .showLess': 'showLess'
        },
        el: 'body',
        more: ' ...Show more',
        less: ' Show less',
        initialize: function () {},
        render: function (text, limit) {
            if (!text) {
                return '';
            } else if (text && text.length <= limit + this.more.length) {
                return text;
            } else if (text) {
                var limitedtext = text.substr(0, limit);
                limitedtext += '<span class="showMore"><a>' + this.more + '</a></span>';
                limitedtext += '<span class="hiddenText">' + text.substr(limit) + '</span>';
                limitedtext += '<span class="showLess hidden"><a>' + this.less + '</a></span>';
                return limitedtext;
            }
        },
        showMore: function (e) {
            var node = $(e.currentTarget);
            node.hide();
            node.nextAll('.showLess').show();
            node.nextAll('.hiddenText').fadeIn(400, function () {});
        },
        showLess: function (e) {
            var node = $(e.currentTarget);
            node.hide();
            node.prevAll('.showMore').show();
            node.prevAll('.hiddenText').fadeOut(400, function () {});
        },
        remove: function () {
            this.setElement(null);
            this.constructor.__super__.remove.apply(this, arguments);
        }
    });
    return genericShowMore;
});
