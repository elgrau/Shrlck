/* global user */
'use strict';
define(['views/common/editableView', 'views/elements/genericDataTable', 'text!templates/elements/genericModal.ejs'], function (EditableView, GenericDataTableView, genericModalTemplate) {
    var gliterals = window.literals;
    /**
     *
     * @name Views.Elements.CollectionDatatable
     * @constructor
     * @augments Backbone.View
     */
    var CollectionDatatable = Backbone.View.extend( /** @lends Views.Elements.CollectionDatatable.prototype **/ {
        /**
         * Events
         * @type {Object}
         */
        events: {
            'click button[action="addElement"]': 'addElement',
            'click button[action="modifyElement"]': 'modifyElement',
            'click button[action="removeElement"]': 'removeElement',
            'click button[action="saveElement"]': 'saveElement'
        },
        showOptionsColumns: false,
        showExtraInformation: function (resource) {
            return '<div style="padding: 15px;border: 1px dashed gray;background-color: #fafafa;">' + resource.get('extraInformation') + '</div>';
        },
        /**
         * Renders CronDataTableView
         */
        render: function () {
            var _self = this;
            this.collection.fetch({
                success: function () {
                    _self.configureTable();
                    _self.renderTable();
                }
            });
        },
        renderTable: function () {
            this.datatable = new GenericDataTableView(this.tableConfig);
            this.$el.html(this.datatable.$el);
            this.datatable.render();
        },
        configureTable: function () {
            var _self = this;
            this.tableConfig = {
                dataTable: {
                    bAutoWidth: false,
                    search: false,
                    aoColumns: [],
                    aaData: _self.collection.toJSON(),
                    'fnRowCallback': function (nRow, aData, iDisplayIndex) {
                        var resource = _self.collection.get(aData.id);
                        if (resource) {
                            if (_self.resourceViews[resource.id]) {
                                _self.resourceViews[resource.id].setElement(nRow);
                            } else {
                                _self.resourceViews[resource.id] = new _self.ResourceView({
                                    model: resource,
                                    el: nRow
                                });
                            }
                        }

                    },
                    'fnDrawCallback': function (oSettings) {
                        _self.addGlobalButtons();

                        if (!_.isUndefined(_self.showExtraInformation) && _.isFunction(_self.showExtraInformation)) {
                            var table = $(this).DataTable();
                            _self.addExtraInformation(table);
                        }
                    }

                }
            };
            this.configureColumns();
        },
        configureColumns: function () {
            var _self = this;
            _.each(this.columns, function (col) {
                var colDef;
                colDef = {
                    'mData': col,
                    'sTitle': col
                };
                if (!_.isUndefined(_self.literals[col])) {
                    colDef.sTitle = _self.literals[col];
                }
                if (_.isObject(col)) {
                    _self.configureColumn(colDef, col);
                }
                _self.tableConfig.dataTable.aoColumns.push(colDef);
            });
            if (this.showOptionsColumns) {
                _self.tableConfig.dataTable.aoColumns.push({
                    sTitle: gliterals.options,
                    mData: null,
                    bSortable: false,
                    sWidth: '75px',
                    mRender: function (data, type, full) {
                        var result = '';
                        var resource = _self.collection.get(full.id);
                        if (resource.canModify()) {
                            result += '<button title="Edit Element" class="btn btn-small" action="modifyElement"><i class="fa fa-edit fa-large"></i></button>';
                        }
                        if (resource.canDelete()) {
                            result += '<button title="Remove Element" class="btn btn-small btn-danger" action="removeElement"><i class="fa fa-trash-o fa-small"></i></button>';
                        }
                        return result;
                    }
                });
            }
            if (!_.isUndefined(this.showExtraInformation) && _.isFunction(this.showExtraInformation)) {
                // Adds the column to show the details.
                _self.tableConfig.dataTable.aoColumns = _.union([{
                    sTitle: '',
                    bSortable: false,
                    mData: null,
                    mRender: function (data, type, full) {
                        return '<button title="' + gliterals.showMore + '" class="btn btn-mini" action="showExtraInformation"><i class="fa fa-angle-down"></i></button>';
                    }
                }], _self.tableConfig.dataTable.aoColumns);
            }
        },
        configureColumn: function (colDef, col) {
            if (!_.isUndefined(col.title)) {
                colDef.sTitle = col.title;
            }
            if (!_.isUndefined(col.render)) {
                colDef.mRender = col.render;
            }
            if (!_.isUndefined(col.sortable)) {
                colDef.bSortable = col.sortable;
            }
            if (!_.isUndefined(col.data)) {
                colDef.mData = col.data;
            }
        },
        addGlobalButtons: function () {
            if (this.collection.canAdd()) {
                this.$('.datatables-top .globalButtons').remove();
                this.$('.datatables-top').prepend('<div class="globalButtons" style="float:right"><button title="Add Element" class="pull-right btn btn-small btn-primary" action="addElement"><i class="fa fa-plus"></i> Add</button></div>');
            }
        },
        addExtraInformation: function (table) {
            var _self = this;
            table.children('tbody').find('tr').each(function (i, nRow) {
                if ($(nRow).find('.info_row').length === 0) {
                    var aData = table.fnGetData(nRow);
                    var resource = _self.collection.get(aData.id);
                    $(nRow).off('click', '[action="showExtraInformation"]');
                    $(nRow).on('click', '[action="showExtraInformation"]', function (e) {
                        e.preventDefault();
                        if (table.fnIsOpen(nRow)) {
                            table.fnClose(nRow);
                        } else {
                            table.fnOpen(nRow, _self.showExtraInformation(resource), 'info_row');
                        }
                        $(nRow).find('button[action="showExtraInformation"] i').toggleClass('fa-angle-up').toggleClass('fa-angle-down');

                    });
                }
            });
        },
        removeElement: function (e) {
            var node = $(e.currentTarget);
            var nRow = node.closest('tr').get(0);
            var table = this.datatable.getDataTable();
            var data = table.fnGetData(nRow);
            var resource = this.collection.get(data.id);

            var removeIt = function removeIt() {
                var uniq = uniqid('removing');
                resource.destroy({
                    beforeSend: function () {
                        $('body').trigger('showNotificationModal', ['Removing', uniq]);
                    },
                    success: function () {
                        $('body').trigger('hideNotificationModal', [uniq]);
                        table.fnDeleteRow(nRow);
                    },
                    error: function () {
                        $('body').trigger('hideNotificationModal', [uniq]);

                    }
                });
            };
            if (!_.isUndefined(this.literals.removeElementConfirmation)) {
                confirm(this.literals.removeElementConfirmation, removeIt);
            } else {
                removeIt();
            }
        },
        addElement: function (e) {
            var resource = new this.collection.model();
            this.resourceViews[resource.id] = new this.ResourceView();
            this.showEditing('add', resource);
        },
        modifyElement: function (e) {
            var node = $(e.currentTarget);
            var nRow = node.closest('tr').get(0);
            var table = this.datatable.getDataTable();
            var data = table.fnGetData(nRow);
            var resource = this.collection.get(data.id);
            this.showEditing('edit', resource);
        },
        showEditing: function (mode, resource) {
            var _self = this;
            var modalButtons = '<button title="' + gliterals.cancel + '" class="btn" data-dismiss="modal">' + gliterals.cancel + '</button><button title="' + gliterals.saveTitle + '" class="btn btn-primary" action="saveElement">' + gliterals.save + '</button>';
            this.editingResource = resource;
            var resourceView = _self.resourceViews[resource.id];
            var complexType = resource.getEditable();
            var modalId = uniqid('modal');
            var modalContent = '<form class="submitOnEnter" name="' + modalId + '"><dl class="dl-horizontal">';
            _.each(complexType, function (element, key) {
                var l = _self.literals[key];
                var d = '';
                if (!_.isUndefined(resource.get(key))) {
                    d = resource.get(key);
                    if (!_.isUndefined(d) && d && !_.isUndefined(d.text)) {
                        d = d.text;
                    }
                }
                modalContent += '<dt title="' + l + '" data-toggle="tooltip">' + l + '</dt><dd modelid="' + key + '" ><div>' + d + '</div></dd>';
            });
            modalContent += '</dl></form>';
            var title;
            if (mode === 'edit') {
                title = gliterals.edit;
            } else if (mode === 'add') {
                title = gliterals.add;
            }
            var modal = _.template(genericModalTemplate, {
                id: 'bootstrapmodal_' + modalId,
                title: title,
                content: modalContent,
                buttons: modalButtons
            });
            $(modal).modal();
            $('#bootstrapmodal_' + modalId).on('hidden', function () {
                _self.setElement(_self.$el.not('#bootstrapmodal_' + modalId));
                resourceView.setElement(resourceView.$el.not('#bootstrapmodal_' + modalId));
                $(this).remove();
            });
            resourceView.setElement(resourceView.$el.add('#bootstrapmodal_' + modalId));
            this.setElement(this.$el.add('#bootstrapmodal_' + modalId));

            _.each(complexType, function (element, key) {
                var value = '';
                if (!_.isUndefined(resource.get(key))) {
                    value = resource.get(key);
                }
                EditableView.prototype.convertFieldToEditable($('#bootstrapmodal_' + modalId + ' dd[modelid="' + key + '"]'), complexType[key], value);
            });
            this.postProcessModal(mode, resource);
            if (!_.isUndefined(this.resourceViews[resource.id])) {
                this.resourceViews[resource.id].editing();
            }
        },
        postProcessModal: function (mode, resource) {

        },
        saveElement: function (e) {
            var _self = this;
            var node = $(e.currentTarget);
            var modal = node.closest('.modal');
            var resource = this.editingResource;
            var resourceView = _self.resourceViews[resource.id];
            var complexType = resource.getEditable();
            var attributes = {};
            _.each(complexType, function (ct, key) {
                var value = null;
                try {
                    value = EditableView.prototype.getEditableFieldValue(modal.find('dd[modelid="' + key + '"]'), ct);
                } catch (e) {
                    value = modal.find('dd *[modelid="' + key + '"]').val();
                }
                attributes[key] = value;
            });
            var uniq = uniqid('saving');
            resource.save(attributes, {
                beforeSend: function () {
                    $('body').trigger('showNotificationModal', ['Saving', uniq]);
                },
                success: function () {
                    $('body').trigger('hideNotificationModal', [uniq]);
                    _self.collection.add(resource);
                    modal.modal('hide');
                    var table = _self.datatable.getDataTable();
                    if (/tr/i.test(resourceView.$el.get(0).localName)) {
                        //Modify element
                        table.fnUpdate(resource.toJSON(), resourceView.$el.get(0));
                    } else {
                        //Add element
                        table.fnAddData(resource.toJSON());
                    }
                },
                error: function () {
                    $('body').trigger('hideNotificationModal', [uniq]);
                },
                wait: true
            });

        }
    });
    return CollectionDatatable;
});
