'use strict';
define(['text!templates/elements/genericModal.ejs'], function (genericModalTemplate) {
    var modal = Backbone.View.extend({
        events: {
            'shown.bs.modal': 'modalShown',
            'hidden.bs.modal': 'sendEvent'
        },
        initialize: function (options) {
            this.options = _.defaults(options, {
                classes: '',
                content: '',
                id: 'bootstrapmodal',
                container: '',
                showHeader: true,
                showHeaderCloseButton: true,
                title: null,
                onCloseAction: null,
                buttons: null,
                onShown: function () {}
            });
            this.template = _.template(genericModalTemplate);
            var _self = this;
            $(window).on('resize', function (event) {
                _self.autoAdjust();
            });
        },
        render: function () {
            var config = this.options;
            if (!_.isString(config.content) && _.isObject(config.content)) {
                this.$content = config.content;
                config.content = '';
            }
            if (_.isUndefined(config.onCloseAction) || !config.onCloseAction) {
                config.protection = '';
                config.onclosebutton = 'data-dismiss="modal"';
            } else {
                config.protection = 'data-backdrop="static" data-keyboard="false"';
                config.onclosebutton = 'action="' + config.onCloseAction + '"';
            }
            this.setElement(this.template(config));
            if (this.options.onShown && _.isFunction(this.options.onShown)) {
                this.$el.on('shown', this.options.onShown);
            }

            this.$el.modal();
        },
        modalShown: function (e) {
            if (this.$content) {
                this.$('.modal-body').append(this.$content);
                delete this.$content;
            }
            this.sendEvent(e);
            this.autoAdjust();
        },
        hide: function () {
            if ($('body .modal') !== null) {
                $('body').removeClass('modal-open');
            }
            this.$el.modal('hide');
        },
        sendEvent: function (e) {
            this.trigger(e.type, e, this);
        },
        autoAdjust: function () {

            var wHeight = $(window).height() / 2,
                wWidth = $(window).width() / 2;

            if ($(this.$el).width() < 100) {
                var newWidth = wWidth - 40;
                $(this.$el)
                    .css('left', '0px')
                    .css('top', '0px')
                    .css('width', newWidth + 'px');

            }

            wWidth = wWidth - $(this.$el).width() / 2;
            wHeight = wHeight - $(this.$el).height() / 2;

            if (wHeight < 0) {
                wHeight = 20;
            }

            $(this.$el)
                .clearQueue()
                .stop()
                .animate({
                    'left': wWidth + 'px',
                    'margin-left': '0px',
                    'top': wHeight + 'px',
                    'margin-top': '0px'
                }, 100);

        },
        remove: function () {
            $(window).off('resize', this.autoAdjust);
        }
    });
    return modal;
});
