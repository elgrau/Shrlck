'use strict';
define([], function () {
    var genericTree = Backbone.View.extend({
        events: {
            'tree.open': 'triggerLayout',
            'tree.close': 'triggerLayout',
            'click .addnode': 'addNode',
            'click .delnode': 'removeNode',
            'click .jqtree-title': 'editNodeName'
        },
        squareTemplate: '<div style="width: 8px;height: 13px;position: absolute;left: -10px;border-left: 1px dotted gray;border-bottom: 1px dotted gray;top: -2px;">&nbsp;</div>',
        initialize: function () {
            var _self = this;

            var updateLayout = _.debounce(function () {
                _self.triggerLayout();
            }, 100);
            this.options = {
                autoOpen: true,
                dragAndDrop: true,
                selectable: false,
                closedIcon: '<i class="fa fa-plus-square-o" style="font-size: 17px;position: relative;top: -4px;"></i>',
                openedIcon: '<i class="fa fa-minus-square-o" style="font-size: 17px;position: relative;top: -4px;"></i>',
                onCreateLi: function (node, $li) {
                    $li.attr('data-node-id', node.id);
                    if (node.children.length === 0) {
                        $li.children('div.jqtree-element').prepend(_self.squareTemplate);
                    }
                    if (!_.isUndefined(_self.options.onCreateNode) && _.isFunction(_self.options.onCreateNode)) {
                        _self.options.onCreateNode(node, $li);
                    }
                    if (!_.isUndefined(_self.options.canAdd) && _.isFunction(_self.options.canAdd) && _self.options.canAdd(node, $li)) {
                        $li.find('.jqtree-element').append(
                            '<a href="#node-' + node.id + '" class="addnode btn btn-micro" data-node-id="' +
                            node.id + '" style="margin-left: 10px;" title="Add new node">+</a>'
                        );
                    }
                    if (!_.isUndefined(_self.options.canDelete) && _.isFunction(_self.options.canDelete) && _self.options.canDelete(node, $li)) {
                        $li.find('.jqtree-element').append(
                            '<a href="#node-' + node.id + '" class="delnode btn btn-micro btn-danger" data-node-id="' +
                            node.id + '" style="margin-left: 10px;" title="Delete node"><i class="fa fa-trash-o"></i></a>'
                        );
                    }
                    updateLayout();
                }
            };
            return this;
        },
        render: function (options) {
            if (options) {
                this.options = $.extend(true, {}, this.options, options);
            }
            this.$el.tree(this.options);
        },
        triggerLayout: function () {
            this.trigger('layout');
        },
        //
        // Tree Events:
        //
        addNode: function (e) {
            var $tree = this.$el;
            e.preventDefault();
            e.stopPropagation();
            // Get the id from the 'node-id' data property
            var nodeId = $(e.target).closest('li').data('node-id');
            var parentNode = $tree.tree('getNodeById', nodeId);
            prompt('Add node with name:', function (input) {
                input = input || 'New Node';
                $tree.tree(
                    'appendNode', {
                        label: _.escape(input),
                        id: uniqid(),
                        newNode: true
                    },
                    parentNode
                );
                $tree.tree('openNode', parentNode);
            }, null, 'New Node');
        },
        removeNode: function (e) {
            var $tree = this.$el;
            e.preventDefault();
            e.stopPropagation();
            // Get the id from the 'node-id' data property
            var nodeId = $(e.target).closest('li').data('node-id');
            var node = $tree.tree('getNodeById', nodeId);
            if (node.parent.parent) {
                // We move all the childrens
                for (var i = node.children.length - 1; i >= 0; i--) {
                    var child = node.children[i];
                    $tree.tree('moveNode', child, node, 'after');
                }
                $tree.tree('removeNode', node);
            }
        },
        editNodeName: function (e) {
            var $tree = this.$el;
            e.preventDefault();
            var nodeId = $(e.target).closest('li').data('node-id');
            var node = $tree.tree('getNodeById', nodeId);
            if (!_.isUndefined(this.options.canEdit) && _.isFunction(this.options.canEdit) && this.options.canEdit(node)) {
                prompt('Change node name:', function (input) {
                    if (_.isEmpty(input.trim())) {
                        warning('Please write a node name');
                    } else {
                        $tree.tree('updateNode', node, _.escape(input));
                    }
                }, null, 'New Node', node.name);
            }
        }
    });
    return genericTree;
});
