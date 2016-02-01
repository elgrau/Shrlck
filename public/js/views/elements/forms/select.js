/* global literals */
'use strict';
define([
    'views/elements/forms/element',
    'text!templates/elements/forms/select.ejs'
], function (
    FormElement,
    selectTemplate
) {
    /**
     * to create combobox or list (multiple)
     */
    var SelectView = FormElement.extend({
        template: _.template(selectTemplate),
        selector: 'select',
        events: {},
        defaults: {
            classes: '',
            name: '',
            id: '',
            label: '',
            data: [],
            multiple: false,
            required: false,
            readonly: false,
            disabled: false,
            size: 4,
            emptyOption: true,
            value: ''
        },
        initialize: function (options) {
            this.options = _.extend({}, this.defaults, options);

        }
    });
    return SelectView;
});
