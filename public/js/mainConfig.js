'use strict';
require.config({
    baseUrl: '/',
    paths: {
        //Require plugins:
        text: 'vendor/require/text',
        image: 'vendor/require/image',
        async: 'vendor/require/async',
        font: 'vendor/require/font',
        goog: 'vendor/require/goog',
        json: 'vendor/require/json',
        noext: 'vendor/require/noext',
        mdown: 'vendor/require/mdown',
        propertyParser: 'vendor/require/propertyParser',

        templates: 'templates',
        models: 'js/models',
        utils: 'js/utils',
        views: 'js/views',

        // Libraries
        jquery: 'vendor/jquery/jquery',

        moment: 'vendor/moment/moment-with-locales.min',

        underscore: 'vendor/underscore/underscore',
        backbone: 'vendor/backbone/backbone',
        BackboneHATEOAS: 'vendor/backboneHATEOAS/Backbone.HATEOAS',
        backboneEpoxy: 'vendor/backboneEpoxy/backbone.epoxy',
        bootstrap: 'vendor/bootstrap/bootstrap',
        bootstrapmodalmanager: 'vendor/bootstrap/bootstrap-modalmanager',
        bootstrapmodal: 'vendor/bootstrap/bootstrap-modal',
        bootstrapdatepicker: 'vendor/bootstrap/bootstrap-datepicker',

        md5: 'vendor/md5/md5',

        atmosphere: 'vendor/atmosphere/atmosphere'
    },
    shim: {
        'less': {
            exports: 'less'
        },
        'jquery': {
            exports: '$'
        },
        'backbone': {
            exports: 'Backbone',
            deps: ['underscore']
        },
        'BackboneHATEOAS': {
            exports: 'Backbone.HAL',
            deps: ['backbone']
        },
        'backboneEpoxy': {
            exports: 'Backbone.Epoxy',
            deps: ['backbone']
        },
        'moment': {
            deps: ['jquery']
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrapmodalmanager': {
            deps: ['bootstrap']
        },
        'bootstrapmodal': {
            deps: ['bootstrapmodalmanager']
        },
        'bootstrapdatepicker': {
            deps: ['bootstrap']
        }
    },
    waitSeconds: 20
});
require(['js/main']);