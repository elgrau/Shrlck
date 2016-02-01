/* global literals */
// Defining namespaces for the whole project
/**
 * @namespace Models
 */
/**
 * @namespace Collections
 */
/**
 * @namespace Views
 */
/**
 * @namespace Routers
 */
/**
 * @namespace Utils
 */
'use strict';
require(['BackboneHATEOAS', 'backboneEpoxy', 'less', 'jquery', 'moment', 'underscore', 'backbone', 'bootstrap', 'bootstrapmodalmanager', 'bootstrapmodal', 'bootstrapcolorpicker', 'bootstrapdatepicker', 'bootstrapdatepickercustom', 'bootstraptoggle', 'utils/otherUtils'], function() {
  window.versionHTML = $('head > meta[name="versionHTML"]').attr('content');
  if (/%%versionHTML%%/i.test(window.versionHTML)) {
    window.versionHTML = null;
  }
  window.version = $('head > meta[name="version"]').attr('content');
  if (/%%version%%/i.test(window.version)) {
    window.version = null;
  }
  $.support.cors = true;

  $.ajaxSetup({
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    cache: false
  });


  //Making toJSON Recursive
  Backbone.Model.prototype.toJSON = function() {
    if (this._isSerializing) {
      return this.id || this.cid;
    }
    this._isSerializing = true;
    var json = _.clone(this.attributes);
    _.each(json, function(value, name) {
      _.isFunction((value || '').toJSON) && (json[name] = value.toJSON());
    });
    this._isSerializing = false;
    return json;
  };

  //EXTEND Backbone.Epoxy.Model from Backbone.HAL.Model
  Backbone.Epoxy.Model.prototype._super = Backbone.HAL.Model;
  Backbone.Epoxy.Model = Backbone.HAL.Model.extend(Backbone.Epoxy.Model.prototype);

  Backbone.Epoxy.binding.addHandler('complex', {
    get: function($element, value, event) {
      console.debug($element, value, event);
    },
    set: function($element, value) {
      console.debug($element, value);
    }
  });

  Backbone.Epoxy.binding.addHandler('keyText', {
    init: function($element, value, bindings, context) {
      this.targetAttribute = context.attr;
    },
    get: function($element, value, event) {
      var obj = {};
      if ($element.is('[class*="select2"]')) {
        //Select2
        var select2Data = $element.select2('data');
        if (select2Data && !_.isEmpty(select2Data.id)) {
          obj[this.targetAttribute] = {
            key: select2Data.id,
            text: select2Data.text
          };
        } else {
          obj[this.targetAttribute] = null;
        }
      } else {
        var key = $element.val();
        if (!_.isEmpty(key)) {
          obj[this.targetAttribute] = {
            key: key,
            text: $element.find('option[value="' + key + '"]').text()
          };
        } else {
          obj[this.targetAttribute] = null;
        }

      }
      return obj;
    },
    set: function($element, value) {
      if (value && _.isObject(value)) {
        if ($element.is('[class*="select2"]')) {
          $element.select2('val', value.key);
        } else {
          $element.val(value.key);
        }
      }
    }
  });

  Backbone.Epoxy.binding.addHandler('keyTextList', {
    init: function($element, value, bindings, context) {
      this.targetAttribute = context.attr;
    },
    get: function($element, value, event) {
      var obj = {};
      if ($element.get(0).localName === 'input') {
        //Select2-Input
        var select2Data = $element.select2('data');
        obj[this.targetAttribute] = select2Data;
      } else if ($element.is('[class*="select2"]')) {
        //Select2
        var select2Data = $element.select2('data');
        obj[this.targetAttribute] = _.map(select2Data, function(val) {
          return {
            key: val.id,
            text: val.text
          };
        });
      } else {
        var values = $element.val();
        obj[this.targetAttribute] = _.map(values, function(val) {
          return {
            key: val,
            text: $element.find('option[value="' + val + '"]').text()
          };
        });
      }
      return obj;
    },
    set: function($element, value) {
      if (value && _.isArray(value)) {
        var keysList = _.pluck(value, 'key');
        if ($element.get(0).localName === 'input') {
          $element.select2('data', value);
        } else if ($element.is('[class*="select2"]')) {
          $element.select2('val', keysList);
        } else {
          $element.val(keysList);
        }
      }
    }
  });

  require(['views/elements/forms/form'], function() {
    require(['js/router'], function(Router) {
      Router.initialize();
    });
  });
});