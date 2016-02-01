'use strict';
define(['views/elements/genericDataTable', 'text!templates/elements/detailsBox.ejs', 'text!templates/elements/emptySectionMessage.ejs', 'text!templates/elements/loadingMessage.ejs', 'text!templates/elements/genericListKeyValue.ejs', 'text!templates/elements/genericListKeyValueFull.ejs'], function (GenericDataTableView, detailsBoxTemplate, emptySectionMessageTemplate, loadingMessageTemplate, genericListKeyValueTemplate, genericListKeyValueFullTemplate) {
    /**
     * Manages the details box view element.
     * @name Views.Elements.detailsBox
     * @constructor
     * @param {Object} params Initial configuration of the view.
     * @augments Backbone.View
     */
    var detailsBox = Backbone.View.extend( /** @lends Views.Elements.detailsBox.prototype */ {
        tagName: 'section',
        className: 'box  detailsBox',
        listLimitLength: 10,
        loadingTimeout: 120000,
        /**
         * Events
         * @type {Object}
         */
        events: {
            'click a.js-toggle-section': 'toggleSectionClick'
        },
        initialize: function (params) {
            this.loading = false;
            this.literals = {};
            this.otherViews = [];
            if (!_.isUndefined(params) && _.isObject(params)) {
                this.modelElem = params.modelElem;
                this.literals = params.literals;
            }
            return this;
        },
        /**
         * Render the detail box
         * @param  {Object} params
         * @param  {Object} options
         * @return {Object}         The Jquery element
         */
        render: function (params, options) {
            var _self = this;
            options = options || {};
            var regex = /^([a-z]+\/[a-z]+)+$/i;

            if (!_.isUndefined(options.hidden) && options.hidden) {
                this.$el.addClass('hidden');
            }
            if (!_.isUndefined(options.loading) && options.loading) {
                this.$el.addClass('loading');
            } else {
                options.loading = false;
            }
            if (_.isUndefined(params)) {
                params = {};
            }
            if (_.isUndefined(params.id)) {
                params.id = params.title;
            }
            if (!_.isUndefined(params.prerel) && params.prerel && params.prerel !== '') {
                params.rel = params.prerel + '_' + params.id;
            } else {
                params.rel = params.id;
            }

            this.$el.attr('rel', params.rel);
            this.$el.attr('section', params.id);
            if (this.modelElem) {
                this.$el.attr('dossierId', this.modelElem.id);
                this.$el.attr('dossierType', this.modelElem.type);
            }

            if (options.creatorView && regex.test(options.creatorView) && options.creatorView && options.creatorView !== '') {
                // IF is a View
                _self.viewRenderTreatement(params, options.creatorView);
            } else {
                //IF is a Template
                _self.templateRenderTreatement(params, options.loading, options.loadUIView);
            }
            return _self.$el;
        },
        /**
         * Render a view
         * @param  {Object} params   [description]
         * @param  {String} viewName Name of the view to requiere
         * @inner
         */
        viewRenderTreatement: function (params, viewName) {
            var content = _.template(loadingMessageTemplate, {});
            var box = _.template(detailsBoxTemplate, {
                'body': content,
                'data': params
            });
            this.$el.append(box);
            var _self = this;
            require(['views/' + viewName], function (RequiredView) {
                _self.view = new RequiredView({
                    modelElem: _self.modelElem,
                    literals: _self.literals
                });
                if (_self.view) {
                    content = _self.view;
                    if (!_.isUndefined(content) && !_.isUndefined(content.$el)) {
                        _self.$('.box-content-body').html('');
                        _self.$('.box-content-body').append(content.$el);
                        content.render(params);
                        if (_self.$('.box-content-body .detailsBoxFooter').length > 0) {
                            _self.$('.detailsBoxBody > .detailsBoxFooter').remove();
                        }
                        content.setElement(_self.$el);
                    } else {
                        _self.$('.box-content-body').html('');
                        content = _self.view.render(params);
                        if (/detailsBoxFooter/i.test(content)) {
                            _self.$('.detailsBoxFooter').remove();
                        }
                        _self.$('.detailsBoxBody').append(content.$el);
                        //_self.view.setElement(_self.$('.box-content-body'));
                        _self.view.setElement(_self.$el);
                    }
                    _self.$el.trigger('boxAddedToView', [_self.view]);
                    _self.trigger('boxAddedToView', _self.view);
                } else {
                    console.log('The View ' + viewName + ' is not defined');
                }
            });
        },
        /**
         * Render a template
         * @param  {Object} params
         * @param  {Boolean} loading
         * @param  {Boolean} loadUIView
         * @inner
         */
        templateRenderTreatement: function (params, loading, loadUIView) {
            var _self = this;
            var empty = false;
            var box = _.template(detailsBoxTemplate, {
                'body': '',
                'data': params
            });
            this.$el.append(box);
            var contentDefault = this.getContentDefault(params);

            if (contentDefault) {
                _.each(contentDefault, function (el) {
                    try {
                        var element = el();
                        if (!_.isUndefined(element.$el)) {
                            _self.$('.box-content-body').append(element.$el);
                            element.render();
                        } else {
                            _self.$('.box-content-body').append(element);
                        }
                    } catch (e) {
                        console.log(e.stack);
                    }
                });
            } else {
                empty = true;
                if (loading) {
                    this.$('.box-content-body').append(_.template(loadingMessageTemplate, {}));
                } else {
                    this.$('.box-content-body').append(_.template(emptySectionMessageTemplate, {}));
                }
            }
            if (!empty && !loading && !_.isUndefined(this.modelElem) && !_.isUndefined(this.modelElem.view.type) && loadUIView) {
                require(['views/' + this.modelElem.view.type + '/' + params.id], function (ReqView) {
                    _self.view = undefined;
                    try {
                        _self.view = new ReqView({
                            modelElem: _self.modelElem,
                            literals: _self.literals,
                            el: _self.$el
                        });
                        if (_self.view.render && _.isFunction(_self.view.render)) {
                            _self.view.render();
                        }
                    } catch (e) {}
                    _self.$el.trigger('boxAddedToView', [_self.view]);
                    _self.trigger('boxAddedToView', _self.view);
                }, function (err) {
                    console.log(err);
                });
            } else {
                this.$el.trigger('boxAddedToView', [this.view]);
                this.trigger('boxAddedToView', this.view);
            }
        },
        /**
         * Add content to the current html
         * @param {Object} params
         * @param {Object} body
         */
        addContent: function (params, body) {
            var box = _.template(detailsBoxTemplate, {
                'body': body,
                'data': params
            });
            this.$el.append(box);
        },
        /**
         * Returns the default template only knowing the template-params
         * @param  {Object} params
         * @return {String}        The default template
         * @inner
         */
        getContentDefault: function (params) {
            var _self = this;
            var contents = [];
            if (!_.isUndefined(params.keyValueData) && _.isArray(params.keyValueData)) {
                contents.push(function () {
                    return _.template(genericListKeyValueTemplate, {
                        'data': params
                    });
                });
            }
            if (!_.isUndefined(params.keyValueDataFull) && _.isArray(params.keyValueDataFull)) {
                contents.push(function () {
                    return _.template(genericListKeyValueFullTemplate, {
                        'data': params
                    });
                });
            }
            if (!_.isUndefined(params.dataTable) && _.isArray(params.dataTable)) {
                _.each(params.dataTable, function (dt) {
                    var auxparams = $.extend(true, {}, params);
                    auxparams.dataTable = dt;
                    contents.push(function () {
                        var view = new GenericDataTableView(auxparams);
                        _self.otherViews.push(view);
                        return view;
                    });
                });
            } else if (!_.isUndefined(params.dataTable) && _.isObject(params.dataTable)) {
                contents.push(function () {
                    var view = new GenericDataTableView(params);
                    _self.otherViews.push(view);
                    return view;
                });
            }
            if (contents.length < 1) {
                return null;
            } else {
                return contents;
            }
        },
        /**
         * Manage the click to toggle the section
         * @param  {Event} e
         * @inner
         */
        toggleSectionClick: function (e) {
            var toggle = $(e.currentTarget),
                body = toggle.closest('.detailsBox[rel]').children('.detailsBoxBody').stop(true, true);
            return this.toggleSection(toggle, body);
        },
        /**
         * Toggle the section
         * @param  {Object} toggle Jquery element to toggle.
         * @param  {Object} body   Jquery element
         * @return {Boolean}       Alwaysreturn false
         */
        toggleSection: function (toggle, body) {
            toggle.find('i').toggleClass('fa fa-angle-down').toggleClass('fa fa-angle-up').toggleClass('icon-white');
            body.slideToggle();
            return false;
        },
        remove: function () {
            if (this.view) {
                this.view.remove();
            }
            _.each(this.otherViews, function (view) {
                view.remove();
            });
            this.constructor.__super__.remove.apply(this, arguments);
        }
    });
    return detailsBox;
});
