'use strict';
define([
    'views/elements/forms/element',
    'text!templates/elements/forms/radio.ejs'
], function (
    FormElement,
    radioTemplate
) {
    /**
     * to create radio buttons
     */
    var RadioView = FormElement.extend({
        template: _.template(radioTemplate),
        events: {},
        defaults: {
            classes: '',
            name: '',
            label: '',
            id: '',
            readonly: false,
            required: false,
            disabled: false,
            checked: false
        },
        initialize: function (options) {
            this.options = _.extend({}, this.defaults, options);
        }
    });
    return RadioView;
});
