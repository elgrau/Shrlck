'use strict';
define([
    'views/elements/forms/element',
    'text!templates/elements/forms/date.ejs'
], function (
    FormElement,
    inputTemplate
) {
    /**
     * this view is used in order to create the date fields
     */
    var inputView = FormElement.extend({
        template: _.template(inputTemplate),
        selector: 'input.datepicker',
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
            validation: null
        },
        initialize: function (options) {
            this.options = _.extend({}, this.defaults, options);
        },
        initComponents: function () {
            this.$('.datepicker').datepicker({
                format: 'dd/mm/yyyy',
                weekStart: 1
            }).on('changeDate', function () {
                $(this).change();
                $(this).datepicker('hide');
            });
        }
    });
    return inputView;
});
