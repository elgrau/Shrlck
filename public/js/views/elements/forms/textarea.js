'use strict';
define([
    'views/elements/forms/element',
    'text!templates/elements/forms/textarea.ejs'
], function (
    FormElement,
    textareaTemplate
) {
    /**
     * to create textareas
     */
    var textareaView = FormElement.extend({
        template: _.template(textareaTemplate),
        selector: 'textarea',
        events: {},
        defaults: {
            classes: '',
            id: '',
            name: '',
            label: '',
            value: '',
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
    return textareaView;
});
