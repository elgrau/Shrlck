/*globals literals, user*/
'use strict';
define([
    'views/elements/forms/element',
    'text!templates/elements/forms/button.ejs'
], function (
    FormElement,
    buttonTemplate
) {
    /**
     * this view is used in order to create the application buttons
     */
    var buttonView = FormElement.extend({
        template: _.template(buttonTemplate),
        selector: 'button',
        events: {
            'click button[action="deleteFile"]': 'deleteFile'
        },
        defaults: {
            classes: 'btn-primary',
            id: '',
            label: '',
            disabled: false,
            title: '',
            action: '',
            icon: null,
            urldownload: null,
            accept: 'application/pdf',
            hidelabel: false,
            classescontrol: null
        },
        initialize: function (options) {
            this.options = _.extend({}, this.defaults, options);
            if (this.options.type === 'file') {
                this.events = _.extend(this.events, {
                    'change input[type="file"][name="file"]': 'fileSelected'
                });
                this.delegateEvents();
            }
        },
        initComponents: function () {
            if (this.options.urldownload) {
                this.$el.find('button.viewFile, button.removeFile').removeClass('hide');
                this.$el.find('button.uploadFile').addClass('hide');
            }
        },
        /**
         * render the file uploaded
         * @param {Object} data Server response
         * @inner
         */
        manageFileResponse: function (e, data) {
            var node = $(e.currentTarget);
            var form = node.closest('form');
            form.find('button.viewFile, button.removeFile').removeClass('hide');
            form.find('span.uploadFile').addClass('hide');
            node.trigger('uploadCompleted', data);
        },
        fileSelected: function (e) {
            var node = $(e.currentTarget);
            var form = node.closest('form');
            var _self = this;
            e.preventDefault();
            var fileName = node.val();
            if (_.isEmpty(fileName)) {
                return;
            }
            if (/.pdf$/i.test(fileName) || /.xls$/i.test(fileName) || /.xlsx$/i.test(fileName) || /.csv$/i.test(fileName)) {
                var uniq = uniqid('uploadingFile');
                var sendForm = function () {
                    $('body').trigger('showNotificationModal', ['Loading', uniq]);
                    var data = {};
                    if (!_.isUndefined(window.app) && !_.isUndefined(window.app.headers) && window.app.headers) {
                        _.each(window.app.headers, function (value, key) {
                            data[key] = value;
                        });
                    }
                    $.ajax(this.action + '?_csrf=' + user.get('_csrf'), {
                        beforeSend: function () {},
                        data: data,
                        files: $(':file', this),
                        iframe: true
                    }).complete(function (data) {
                        _self.completeFile(e, uniq, data);
                    });
                };
                var formToSend = form.get(0);
                sendForm.apply(formToSend);
            } else {
                alert(literals.uploadFileFail);
            }
        },
        completeFile: function (e, uniq, data) {
            $('body').trigger('hideNotificationModal', [uniq]);

            if (!_.isEmpty(data)) {
                try {
                    // If parse is done it's an error
                    var jsonData = JSON.parse(data.responseText);
                    if (_.isObject(jsonData) && jsonData.fileId) {
                        //Add visualization of the returned data
                        this.manageFileResponse(e, data);
                    } else {
                        alert(jsonData.message);
                    }
                } catch (exception) {}
            } else {
                alert(literals.uploadFileFail);
            }
        },
        deleteFile: function (e) {
            e.preventDefault();
            var node = $(e.currentTarget);
            var form = node.closest('form');
            form.find('input:file').val('');
            form.find('button.viewFile, button.removeFile').addClass('hide');
            form.find('span.uploadFile').removeClass('hide');

        }
    });
    return buttonView;
});
