'use strict';
define([
    'views/elements/forms/element',
    'text!templates/elements/forms/input.ejs'
], function (
    FormElement,
    inputTemplate
) {
    /**
     * creates input elements, input is text/password
     * better do not use type email or date because IE
     * validation are: email, number, etc...
     */
    var InputView = FormElement.extend({
        template: _.template(inputTemplate),
        selector: 'input[type]',
        events: {},
        defaults: {
            type: 'text',
            id: '',
            name: '',
            label: '',
            postlabel: '',
            value: '',
            classes: '',
            placeholder: '',
            required: false,
            readonly: false,
            disabled: false,
            validation: null,
            maxlength: null
        },
        initialize: function (options) {
            this.options = _.extend({}, this.defaults, options);
        }
    });
    return InputView;
});
