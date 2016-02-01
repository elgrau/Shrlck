/* global literals */
'use strict';
define([
    'text!templates/elements/title.ejs',
    'text!templates/elements/forms/errorMessage.ejs',
    'js/views/elements/forms/input',
    'js/views/elements/forms/select',
    //'js/views/elements/forms/select2',
    'js/views/elements/forms/checkbox',
    'js/views/elements/forms/textarea',
    //'js/views/elements/forms/date',
    'js/views/elements/forms/button',
    'js/views/elements/forms/radio',
    'moment'
], function (
    titleTemplate,
    errorMessageTemplate,
    InputView,
    SelectView,
    //Select2View,
    CheckboxView,
    TextareaView,
     //DateView,
    ButtonView,
    RadioView,
    moment
) {
    /**
     * FormElements
     * This view contains all element forms, and validation process
     */
    var FormElements = Backbone.View.extend({
        elements: {
            'title': function (options) {
                return this.titleTemplate(options);
            },
            'input': InputView,
            'select': SelectView,
            //'select2': Select2View,
            'checkbox': CheckboxView,
            'textarea': TextareaView,
            //'date': DateView,
            'button': ButtonView,
            'radio': RadioView
        },
        initialize: function () {
            this.titleTemplate = _.template(titleTemplate);
        },
        addElement: function (element, options, data) {
            if (element !== 'title' && data && !_.isUndefined(data.viewMode)) {
                options.viewMode = data.viewMode;
                if (!_.isUndefined(options.name) && data.model) {
                    options.value = data.model.get(options.name);
                } else {
                    options.value = null;
                }
            }
            if (element === 'title') {
                return this.elements[element].call(this, options);
            } else if (_.isFunction(this.elements[element])) {
                var variablesFromData = ['model', 'bindings', 'events', 'data'];
                _.each(variablesFromData, function (v) {
                    if (!_.isUndefined(options[v]) && !_.isUndefined(data[options[v]])) {
                        options[v] = data[options[v]];
                    }
                });
                var elementView = new this.elements[element](options);
                return elementView.renderTemplate();
            }
        }

    });

    /**
     * extending jQuery functions
     */
    $.fn.initialize = function () {
        this.each(function () {
            if (this.view && this.view.init) {
                this.view.init();
            }
        });
    };
    $.fn.getView = function () {
        var views = this.map(function () {
            if (this.view) {
                return this.view;
            }
        });
        if (views.length === 1) {
            views = views[0];
        }
        return views;
    };
    /**
     * Extending template functionality
     */
    var formElements = new FormElements();
    var oldTpl = _.template;
    _.template = function () {
        var oldResult = oldTpl.apply(this, arguments);
        var result;
        var postProcessTemplate = function (template, data) {
            var finalTemplate = $('<div>').append(template);
            var tags = 'forms-' + _.keys(FormElements.prototype.elements).join(', forms-');
            finalTemplate.find(tags).each(function () {
                var inputName = this.tagName.replace(/forms-/i, '').toLowerCase();
                if (_.isFunction(formElements.elements[inputName])) {
                    var attributes = {};
                    _.each(this.attributes, function (attr) {
                        attributes[attr.name] = attr.value;
                    });
                    $(this).replaceWith(formElements.addElement(inputName, attributes, data));
                }
            });
            return finalTemplate.children();
        };
        if (_.isFunction(oldResult)) {
            var oldTemplateFunc = oldResult;
            result = function () {
                var _oldResult = oldTemplateFunc.apply(this, arguments);
                var _result = postProcessTemplate(_oldResult, arguments[0]);
                return _result;
            };
        } else {
            result = postProcessTemplate(oldResult, arguments[1]);
        }
        return result;
    };
    var elementsViews = _.values(FormElements.prototype.elements);
    var selectors = [];
    _.each(elementsViews, function (view) {
        if (view.prototype.selector) {
            selectors.push(view.prototype.selector);
        }
    });
    _.tpl = {
        initialize: function (context) {
            if (context) {
                $(context).find(selectors.join(',')).initialize();
            }
        }
    };
    /**
     * validator
     * used for the validation of all the forms
     */
    _.validator = {
        scrolled: false,
        changeViewMode: function (context, viewMode) {
            context.$('input,textarea,select').each(function () {
                var view = $(this).getView();
                if (view && view.options) {
                    var options = view.options;
                    options.viewMode = viewMode;
                    view.render();
                    _.tpl.initialize(view.$el);
                }
            });
        },
        errorTemplate: function (label) {
            return $(_.template(errorMessageTemplate, {
                label: label
            }));
        },
        /**
         * add error to dom, if  label isn't specified we put one by default
         */
        addError: function (e, label) {
            label = label || literals.errorFieldRequired;

            var errorTemplate = _.validator.errorTemplate(label);

            $(e)
                .parent()
                .css('position', 'relative')
                .append(errorTemplate)
                .closest('.control-group')
                .addClass('error');
            /**
             * rumble the field
             */
            var rumble = 3,
                distance = 7,
                duration = 450;

            _.validator.rumbleElement(rumble, distance, duration, e);
            /**
             * Scroll to the error element
             */
            _.validator.scrollToElement(e);
        },
        /**
         * Removes the error from DOM
         */
        removeError: function (e) {
            $(e)
                .closest('.control-group')
                .removeClass('error')
                .find('.error-message')
                .remove();
        },
        /**
         * Called by dataValidation()
         * Check the email
         */
        email: function (e) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test($(e).val())) {
                return true;
            } else {
                _.validator.addError(e, literals.errorEmail);
                return false;
            }
        },
        /**
         * Called by dataValidation()
         * Check number
         */
        number: function (e) {
            if (!isNaN($(e).val())) {
                return true;
            } else {
                _.validator.addError(e, literals.errorNumber);
                return false;
            }
        },
        /**
         * Called by dataValidation()
         * Check the date
         */
        date: function (e) {
            var re = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
            var val = $(e).val();
            if (re.test(val) && moment(val.trim(), 'DD/MM//YYYY').isValid()) {
                return true;
            } else {
                _.validator.addError(e, literals.errorDate);
                return false;
            }
        },
        /**
         * If a element has a special rule for the validation, like a email, date...
         */
        dataValidation: function (e) {
            if ($(e).attr('data-validation') && !_.isEmpty(e.value)) {
                if (!_.validator[$(e).attr('data-validation')](e)) {
                    return false;
                }
            }
            return true;
        },
        /**
         * If a element is required
         */
        requiredValidation: function (e) {
            if ($(e).attr('required') && _.isEmpty(e.value)) {
                _.validator.addError(e);
                return false;
            }
            return true;
        },
        /**
         * If a element has maxLength
         */
        maxLengthValidation: function (e) {
            if ($(e).attr('maxlength') > 0 && !_.isEmpty(e.value)) {
                if ($(e).val().length > parseInt($(e).attr('maxlength'))) {
                    _.validator.addError(e, literals.errorMaxLength + $(e).attr('maxlength'));
                    return false;
                }
            }
            return true;
        },
        /**
         * Used by forms validations
         */
        validate: function (context, individual, canBeEmpty) {
            this.valid = true;

            if (individual) {
                _.each(context.$('textarea:visible, select:visible, input:visible'), function (e) {
                    _.validator.removeError(e);
                });
                _.each(individual, function (e) {
                    this.validations(canBeEmpty, e);
                }, this);
            } else {
                _.each(context.$('textarea:visible, select:visible, input:not(".datepicker")'), function (e) {
                    this.validations(canBeEmpty, e);
                }, this);
                _.each(context.$('input:visible(".datepicker")'), function (e) {
                    this.validations(canBeEmpty, e);
                }, this);
                _.each(context.$('input[type=checkbox][required]:not(:checked)'), function (e) {
                    _.validator.addError(e);
                    if (!canBeEmpty) {
                        this.valid = false;
                    }
                }, this);
            }
            _.validator.scrolled = false;
            if (!this.valid) {
                $('body').trigger('showNotificationModal', ['Information', 'warning', literals.errorSomeDataMandatory]);
            }
            return this.valid;
        },
        validations: function (canBeEmpty, e) {
            _.validator.removeError(e);
            if (canBeEmpty) {
                if (!_.isEmpty($(e).val()) && $(e).attr('data-validation') && !_.validator[$(e).attr('data-validation')](e)) {
                    this.valid = false;
                }
            } else {
                if (!(_.validator.dataValidation(e) &&
                        _.validator.requiredValidation(e) &&
                        _.validator.maxLengthValidation(e))) {
                    this.valid = false;
                }
            }
        },
        /**
         * moves the input when an error occurred
         */
        rumbleElement: function (rumble, distance, duration, e) {
            for (var x = 1; x <= 3; x++) {
                $(e)
                    .parent()
                    .animate({
                        left: distance * -1
                    }, duration / rumble / 4)
                    .animate({
                        left: distance
                    }, duration / rumble / 2)
                    .animate({
                        left: 0
                    }, duration / rumble / 4);
            }
        },
        /**
         * makes scroll to the first wrong element
         */
        scrollToElement: function (e) {

            if ($(e).parents('.accordion-body')) {
                var accordion = $(e).parents('.accordion-body');
                if (!accordion.hasClass('in')) {
                    accordion.parent().find('.accordion-toggle').trigger('click');
                }
            }

            if (!_.validator.scrolled && $('.modal').length < 1) {
                $('html, body').animate({
                    scrollTop: $(e).offset().top
                }, 1000);
                _.validator.scrolled = true;
            }
        }

    };

    return FormElements;
});
