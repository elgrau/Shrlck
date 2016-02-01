'use strict';
/**
 * @namespace Views.Elements
 */
define(['text!templates/elements/listTree.ejs'], function (listTreeTemplate) {
    var gliterals = window.literals;
    /**
     * List tree view
     * @name Views.Elements.listTreeView
     * @constructor
     * @augments Backbone.View
     */
    var listTreeView = Backbone.View.extend( /** @lends Views.Elements.listTreeView.prototype */ {
        /**
         * Events
         * @type {Object}
         */
        events: {
            'click button': 'sendButtonEvent',
            'click input[type="checkbox"]': 'checkboxChange',
            'click .dossierTitle': 'clickSpan',
            'click ul > li > ul > li': 'goToSection'
        },
        timeout: null,
        initialize: function () {
            $(window).scroll(function () {
                var offset = $(window).scrollTop();
                var element = $($('.fixed-left-menu')[0]);
                var h = element.height();
                var ph = element.parent().height();
                element.css({});

                if (offset < 80) {
                    element.stop().animate({
                        marginTop: 0
                    }, 100);
                } else if ((h + offset) >= ph) {
                    offset = ph - (h + offset);
                    element.stop().animate({
                        marginTop: offset
                    }, 100);
                } else if (offset >= 80) {
                    element.stop().animate({
                        marginTop: -50
                    });
                }
            });
        },
        /**
         * Render the tree
         * @param  {Object} context Visualization context
         * @param  {Object} options
         * @return {Object}         This
         */
        render: function (context, options) {

            // Default options
            var defaults = {
                'startCollapsed': 'notfirst',
                'selected': context,
                'minimizebutton': true
            };
            options = $.extend(defaults, options);

            // Validate the user entered default selections.
            options.selected = [_.first(options.selected)];
            var data = {
                'context': context,
                'options': options,
                'selected': options.selected
            };
            // Generate the list tree.
            this.setElement('#listTree');
            this.$el.html(_.template(listTreeTemplate, {
                'context': data.context,
                'options': data.options,
                'literals': gliterals
            }));
            this.delegateEvents();
            this.setSortableOption();

            this.$el.data('listTree', {
                'target': data.target,
                'context': data.context,
                'options': data.options,
                'selected': data.selected
            });
            return this;

        },
        /**
         * It sets the possibility to drag and drop in the tree
         * @inner
         */
        setSortableOption: function () {
            $('#listTree ul ul').sortable({
                cursor: 'move',
                items: 'li:not(.fixed)',
                axis: 'y',
                helper: 'clone',
                cancel: 'input',
                distance: 10,
                stop: function (event, ui) {
                    $('#listTree').trigger('listMoved', ui);
                }
            });
            $('#listTree ul > li').disableSelection();
        },

        /**
         * Render the addition
         * @param  {Object} context Visualization context
         * @param  {String} mode    The render mode. If null append
         * @return {Object}         This
         */
        renderAdd: function (context, mode) {
            var that = this;
            mode = mode || 'append';
            var options = {
                'startCollapsed': true,
                'selected': [],
                'minimizebutton': false
            };
            var data = {
                'context': context,
                'options': options,
                'selected': []
            };
            var html = _.template(listTreeTemplate, {
                'context': data.context,
                'options': data.options,
                'literals': gliterals
            }).trim();

            $(html).children('ul > li').each(function (i, e) {
                that.$el.children('ul')[mode](e);
            });

            this.delegateEvents();
            this.setSortableOption();

            this.$el.data('listTree', {
                'target': data.target,
                'context': data.context,
                'options': data.options,
                'selected': data.selected
            });

            return this;
        },
        /**
         * Alias for rederAdd with mode prepend
         * @param  {Object} context
         */
        renderPrepend: function (context) {
            this.renderAdd(context, 'prepend');
        },
        /**
         * Alias for rederAdd with mode append
         * @param  {Object} context
         */
        renderAppend: function (context) {
            this.renderAdd(context, 'append');
        },
        /**
         * Scroll to the clicked section on the tree
         * @param  {Event} e
         * @inner
         */
        goToSection: function (e) {
            var node = $(e.target);
            if (!/span/i.test(node.localName)) {
                node = node.closest('span');
            }
            var rel = node.find('input').val();
            var goToNode = $('#container .detailsBox[rel="' + rel + '"]:visible');
            if (goToNode.length > 0) {
                $('html, body').animate({
                    scrollTop: goToNode.offset().top - $('#maincontent').offset().top
                });
            }
        },
        /**
         * Manage the hide/show of a section when the user check it in the tree
         * @param  {Event} e
         * @inner
         */
        checkboxChange: function (e) {
            e.stopPropagation();
            var node = $(e.currentTarget);
            var value = node.val();
            if (node.prop('checked')) {
                $('.detailsBox[rel="' + value + '"]').removeClass('hidden');
                $('.detailsBox[rel="' + value + '"]').show();
            } else {
                $('.detailsBox[rel="' + value + '"]').addClass('hidden');
                $('.detailsBox[rel="' + value + '"]').hide();
            }
            try {
                this.$el.trigger('menuHiddenChanged', $(e.target));

                var nodeParent = $(e.target).parent().parent();

                // Toggle all children.
                this.toggleAllChildren(nodeParent);

                // Handle parent checkbox if all children are (un)checked.
                this.handleChildParentRelationship(nodeParent);

                // Filter context to selection and store in data.selected.
                this.updateSelectedObject(nodeParent);

            } catch (err) {
                console.log(err.stack);
            }
            this.goToSection(e);
        },
        /**
         * Show/Hide the dossier in the tree
         * @param  {Event} e
         * @return {Boolean}   false if it's not an input
         * @inner
         */
        clickSpan: function (e) {
            if (e.target.localName === 'input') {
                this.checkboxChange(e);
            } else {
                var node = $(e.currentTarget).parent();

                // Toggle the child list.
                var focus = node.children('ul');

                // Change the icon.
                focus.slideToggle('fast', function () {
                    if (!_.isUndefined(window.sideBarNice)) {
                        window.sideBarNice.resize();
                    }
                });

                return false;
            }
        },

        /**
         * Toggle all checkboxes.
         * @param {Object} jQElement The root <ul> of the list.
         * @inner
         */
        toggleAllChildren: function (jQElement) {
            if (jQElement.children('span').children('input[type="checkbox"]').prop('checked')) {
                this.selectAllChildren(jQElement);
            } else {
                this.deselectAllChildren(jQElement);
            }
        },
        /**
         * If a parent has at least one child node selected, check the parent.
         *  Conversely, if a parent has no child nodes selected, uncheck the parent.
         * @param {Object} jQElement The parent <li>.
         * @inner
         */
        handleChildParentRelationship: function (jQElement) {
            // If the selected node is a child:
            if (_.isEmpty(_.toArray(jQElement.children('ul')))) {
                var childrenStatuses = _.uniq(
                    _.map(jQElement.parent().find('input[type="checkbox"]'), function (elem) {
                        return $(elem).prop('checked');
                    }));

                // Check to see if any children are checked.
                if (_.indexOf(childrenStatuses, true) !== -1) {
                    // Check the parent node.
                    jQElement.parent().parent().children('span').children('input[type="checkbox"]').prop('checked', true);
                } else {
                    // Uncheck the parent node.
                    jQElement.parent().parent().children('span').children('input[type="checkbox"]').prop('checked', false);
                }
            }
        },
        /**
         * Updates the internal object of selected nodes.
         * @inner
         */
        updateSelectedObject: function () {
            var _self = this;
            var data = this.$el.data('listTree');
            // Filter the context to the selected parents.
            var selected = _.filter($.extend(true, {}, data.context), function (parent) {
                return _self.$('ul > li > span > input[value="' + parent.key + '"]').prop('checked');
            });
            // For each parent in the working context...
            _.each(selected, function (parent) {

                // Filter the children to the selected children.
                parent.values = _.filter(parent.values, function (child) {
                    return _self.$('ul > li > ul > li > span > input[value="' + child.key + '"]').prop('checked');
                });
            });

            // Update the plugin's selected object.
            this.$el.data('listTree', {
                'target': data.target,
                'context': data.context,
                'options': data.options,
                'selected': selected
            });
        },
        /**
         * Check all child checkboxes.
         * @param {Object} jQElement The parent <li>.
         * @inner
         */
        selectAllChildren: function (jQElement) {
            var that = this;
            jQElement.find('ul > li:not(.hidden) > span > input[type="checkbox"]').each(function () {
                $(this).prop('checked', true);
                $('#container .detailsBox[rel="' + $(this).val() + '"]').show();
                $('#container .detailsBox[rel="' + $(this).val() + '"]').removeClass('hidden');
                that.$el.trigger('menuHiddenChanged', $(this));
            });
        },

        /**
         * Uncheck all child checkboxes.
         * @param {Object} jQElement The parent <li>.
         * @inner
         */
        deselectAllChildren: function (jQElement) {
            var that = this;
            jQElement.find('ul > li:not(.hidden) > span > input[type="checkbox"]').each(function () {
                $(this).prop('checked', false);
                $('#container .detailsBox[rel="' + $(this).val() + '"]').hide();
                that.$el.trigger('menuHiddenChanged', $(this));
            });
        },
        /** Make sure there isn't any bogus default selections.
         * @param {Object} selected The default selection object.
         * @return The filtered selection object.
         */
        validateDefaultSelectionValues: function (selected) {
            return _.filter(selected, function (elem) {
                return (!_.isEmpty(elem.values) && !_.isUndefined(elem.values));
            });
        },
        /**
         * Used in the edition button
         * @param  {Event} e
         * @return {Boolean}   False
         */
        sendButtonEvent: function (e) {
            this.$el.trigger('buttonEvent', e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
    return listTreeView;
});
