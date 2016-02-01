'use strict';
define([
    'views/elements/forms/element',
    'text!templates/elements/forms/checkbox.ejs'
], function (
    FormElement,
    checkboxTemplate
) {
    /**
     * this view is used in order to create the checkboxes for forms
     */
    var CheckboxView = FormElement.extend({
        template: _.template(checkboxTemplate),
        events: {},
        selector: 'input[type="checkbox"]',
        defaults: {
            classes: '',
            name: '',
            label: '',
            id: window.uniqid(),
            readonly: false,
            required: false,
            disabled: false,
            checked: false,
            toggle: false
        },
        initialize: function (options) {
            this.options = _.extend({}, this.defaults, options);
        },
        initComponents: function () {
            var _self = this;
            this.$('.bootstrap-toggle').bootstrapToggle({
                on: _self.options.label,
                off: _self.options.label
            });
        }
    });
    return CheckboxView;
});
