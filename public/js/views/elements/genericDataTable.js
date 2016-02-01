'use strict';
define(['text!templates/elements/genericDataTableJSON.ejs'], function (genericDataTableJSONTemplate) {
    var genericDataTable = Backbone.View.extend({
        initialize: function (data, hideifempty) {
            this.data = data;
            this.hideifempty = hideifempty;
            this.addIdentifier();
            this.makeUpData();
            this.tableID = uniqid('DataTable');

            var ele = _.template(genericDataTableJSONTemplate, {
                id: this.tableID,
                data: this.data
            });
            this.setElement($(ele));
            return this;
        },
        makeUpFilter: function (data) {
            var filter = {
                aoColumns: []
            };
            var columns = _.map(data.dataTable.aoColumns, function (column) {
                return {
                    type: 'text'
                };
            });
            filter.sPlaceHolder = 'head:after';
            filter.aoColumns = columns;
            this.createFooter(data);
            return filter;
        },
        createFooter: function (data) {
            var titles = _.pluck(data.dataTable.aoColumns, 'sTitle');
            var header = $('<thead>');
            var tr = $('<tr>');
            _.each(titles, function (title) {
                var th = $('<th>').html(title);
                if (_.isEmpty(title)) {
                    th.attr('style', 'display:none');
                }
                tr.append(th);
            });
            header.append(tr.clone());
            header.append(tr.clone());
            this.$el.append(header);
        },
        render: function () {
            var table = $('#' + this.tableID);
            if (this.data.dataTable.filter === false) {
                this.dataTable = table.dataTable(this.data.dataTable);
            } else {
                var filter = this.makeUpFilter(this.data);
                this.dataTable = table.dataTable(this.data.dataTable).columnFilter(filter);
            }
            if (_.isUndefined(window.dataTables)) {
                window.dataTables = {};
            }
            window.dataTables[this.data.dataTable.rel] = this.dataTable;

            if (typeof (this.data.dataTable.title) === 'string' && this.data.dataTable.title !== '') {
                table.prev().before('<div class="datatables-top"><h6 class="center">' + this.data.dataTable.title + '</h6></div>');
            }
            if (typeof (this.hideifempty) !== 'undefined' && this.hideifempty && !this.data.dataTable.aaData.length) {
                table.parent().addClass('hide');
            }
            this.dataTable.css('width', '');
            $('.first.paginate_button, .last.paginate_button').hide();
            $('.next, .prev').show();

        },
        addIdentifier: function () {
            if (_.isArray(this.data.dataTable.aaData) && this.data.dataTable.aaData.length > 0) {
                this.data.dataTable.aaData = _.map(this.data.dataTable.aaData, function (row) {
                    if (!_.isArray(row) && !_.isUndefined(row.identifier) && _.isUndefined(row.DT_RowId)) {
                        row.DT_RowId = '' + row.identifier;
                    }
                    return row;
                });
            }
        },
        makeUpData: function () {
            this.data.dataTable.rel = '';
            if (!_.isUndefined(this.data.prerel) && this.data.prerel) {
                this.data.dataTable.rel += this.data.prerel + '_';
            }
            if (!_.isUndefined(this.data.dataTable.modelid) && this.data.dataTable.modelid) {
                this.data.dataTable.rel += this.data.dataTable.modelid;
            } else if (!_.isUndefined(this.data.dataTable.title) && this.data.dataTable.title) {
                if (!_.isUndefined(this.data.title) && this.data.title) {
                    this.data.dataTable.rel += this.data.title + '_' + this.data.dataTable.title;
                } else {
                    this.data.dataTable.rel += this.data.dataTable.title;
                }
            } else {
                this.data.dataTable.rel += this.data.title;
            }
            var sDom = '';
            if (_.isUndefined(this.data.dataTable.reorder) || this.data.dataTable.reorder) {
                sDom += 'R';
            }
            sDom += '<"datatables-top"';
            if (!_.isUndefined(this.data.dataTable.paginatedTop) && this.data.dataTable.paginatedTop && (_.isUndefined(this.data.dataTable.paginated) || this.data.dataTable.paginated)) {
                sDom += 'ip';
            }
            if (_.isUndefined(this.data.dataTable.search) || this.data.dataTable.search) {
                sDom += 'f';
            }
            if (!_.isUndefined(this.data.dataTable.cvisible) && this.data.dataTable.cvisible) {
                sDom += 'C';
            }
            if (!_.isUndefined(this.data.dataTable.tabletools) && this.data.dataTable.tabletools) {
                sDom += 'T';
            }
            /*if (!_.isUndefined(this.data.dataTable.paginatedTop) && this.data.dataTable.paginatedTop && (_.isUndefined(this.data.dataTable.paginated) || this.data.dataTable.paginated)) {
                sDom += '<"datatables-bottom"ip>';
            }*/
            /*if (!_.isUndefined(this.data.dataTable.paginatedTop) && this.data.dataTable.paginatedTop && (_.isUndefined(this.data.dataTable.paginated) || this.data.dataTable.paginated)) {
                sDom += 'p';
            }*/
            sDom += '>';
            if (_.isUndefined(this.data.dataTable.paginated) || this.data.dataTable.paginated) {
                sDom += 'p';
            }
            sDom += 'rt';
            sDom += '<"datatables-bottom"i';
            if (_.isUndefined(this.data.dataTable.paginated) || this.data.dataTable.paginated) {
                sDom += 'p';
            }
            if (_.isUndefined(this.data.dataTable.number) || this.data.dataTable.number) {
                sDom += 'l';
            }
            sDom += '>';
            sDom += '<"clear">';
            this.data.dataTable = $.extend(true, {}, this.data.dataTable, {
                'sDom': sDom,
                'sPaginationType': 'bootstrap',
                'bDestroy': true,
                'bProcessing': true,
                'oLanguage': {
                    'sLengthMenu': '_MENU_ records per page',
                    'sEmptyTable': 'No data available',
                    'sProcessing': 'Loading...'
                },
                'oColVis': {
                    'buttonText': '<i class="fa fa-cog"> </i> Columns',
                    'sAlign': 'right'
                }
            });
        },
        reDraw: function () {
            if (!_.isUndefined(this.dataTable)) {
                this.dataTable.fnDraw();
            }
        },
        getDataTable: function () {
            return this.dataTable;
        },
        remove: function () {
            try {
                this.dataTable.fnDestroy();
            } catch (e) {
                console.log(e.stack);
            }
            genericDataTable.__super__.remove.apply(this, arguments);
        }
    });
    return genericDataTable;
});
