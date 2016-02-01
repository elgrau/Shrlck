/* global literals */
'use strict';
define([
    'views/elements/forms/select',
    'text!templates/elements/forms/select2.ejs'
], function (
    SelectElement,
    selectTemplate
) {
    /**
     * to create combobox or list (multiple) with select2
     */
    var Select2View = SelectElement.extend({
        selector: 'select',
        template: _.template(selectTemplate),
        events: {},
        initComponents: function () {
            this.$('select').select2({
                placeholder: literals.pleaseSelect,
                allowClear: true
            });
        }
    });
    return Select2View;
});
