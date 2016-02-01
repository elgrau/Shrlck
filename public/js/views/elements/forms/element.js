'use strict';
define([], function () {
    var ElementView = Backbone.Epoxy.View.extend({
        renderTemplate: function () {
            if (!_.isUndefined(this.options.data) && _.isEmpty(this.options.values)) {
                this.options.values = this.options.data;
            }
            var element = $(this.template(this.options));
            this.setElement(element);
            this.setView();
            return this.$el;
        },
        render: function () {
            var element = $(this.template(this.options));
            this.$el.empty();
            this.$el.append(element.children());
            this.setView();
            this.init();
            return this.$el;
        },
        setView: function () {
            var _self = this;
            var target = this.$el;
            if (this.selector) {
                target = this.$(this.selector);
            }
            target.each(function (i, el) {
                el.view = _self;
            });
        },
        init: function () {
            this.applyBindings();
            this.initComponents();
        },
        initComponents: function () {}
    });
    return ElementView;
});
