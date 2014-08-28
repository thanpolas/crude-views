/*
 * crude-views
 * Views for Crude.
 * https://github.com/thanpolas/crude-views
 *
 * Copyright (c) 2014 Thanasis Polychronakis
 * Licensed under the MIT license.
 */

/**
 * @fileOverview Crude Views Base.
 */
var fs = require('fs');

var __ = require('lodash');
var cip = require('cip');
var jade = require('jade');

/**
 * The Crude Views Base.
 *
 * @constructor
 */
var Views = module.exports = cip.extend(function () {

  this.setOptions();


  // set default view template locations
  this.views = {
    add: __dirname + '/../views/add.jade',
    view: __dirname + '/../views/view.jade',
    list: __dirname + '/../views/list.jade',
    edit: __dirname + '/../views/edit.jade',
  };

  /** @type {Object} Store compiled views */
  this.compiled = {};

  var self = this;
  __.forOwn(this.views, function(tpl, key) {
    fs.readFile(tpl, function(err, data){
      if (err) {
        console.error('Error Reading file "' + tpl + '", error:', err);
        return;
      }
      self.compiled[key] = jade.compile(data, {
        filename: tpl
      });
    });
  });
});

/**
 * Set options.
 *
 * @param {Object=} optOptions User defined options.
 */
Views.prototype.setOptions = function(optOptions) {
  var userOpts = {};
  if (__.isObject(optOptions)) {
    userOpts = optOptions;
  }

  /** @type {Object} define default options */
  this.opts = __.defaults(userOpts, {
    baseUrl: 'crude',
    urlField: 'localUrl',
    nameField: 'name',
    idField: 'id',
    // Define this key so 'from' & 'to' params query the right attribute
    dateField: 'createdAt',
    // A jade view
    layoutView: null,
    // The edit / create view.
    editView: null,
    // The single item view
    itemView: null,
    // The list view
    listView: null,
    // show the doc id
    showId: false,
    // show full path for netsted paths
    expandPaths: false,
    // entity Read method
    entityCreate: 'create',
    // entity Read method
    entityRead: 'read',
    // entity ReadLimit method
    entityReadLimit: 'readLimit',
    // entity ReadOne method
    entityReadOne: 'readOne',
    // entity Update method
    entityUpdate: 'update',
    // entity count method
    entityCount: 'count',
    // paths to exclude when displaying
    viewExcludePaths: [],
    // Callback that sanitizes produced result, trumps built-in sanitizer.
    sanitizeResult: null,
    // Do not use views, API (JSON) responses only.
    noViews: false,
    // Set to true to check if user owns the item.
    ownUser: false,
    // required by "ownUser" the property in the request object that represents
    // the user id.
    ownUserRequestProperty: null,
    // required by "ownUser" the schema attribute that represents the user id.
    ownUserSchemaProperty: null,

    // Set to false to not paginate.
    pagination: true,
    // Callback to set the pagination query.
    paginateQuery: null,
    // Default item to limit to on pagination.
    paginateLimit: 6,

    // Key value pairs matching attributes to labels
    labels: {},
  });
};


/**
 * Getter for baseUrl variable, overwrite if custom routing is required.
 *
 * @param {Object} req The request Object.
 * @param {boolean=} hasId set to true if url contains the item id.
 * @return {string} The baseUrl.
 */
Views.prototype.getBaseUrl = function(req, hasId) {
  var url = req.url;
  var reClearUrl = /\/edit|\/add/;
  url = url.replace(reClearUrl, '');
  var len = url.length;

  // remove trailing slash if its there
  if (url[len - 1] === '/') {
    url = url.substr(0, len -1);
  }
  if (hasId) {
    // Remove the :id part
    var idPart = '/' + url.split('/').pop();
    url = url.replace(idPart, '');
  }
  return url;
};




/**
 * Clean the provided document based on 'canShow' schema property,
 * Check for opts.sanitizeResult callback and invoke it.
 *
 * @param {?Object} doc The document.
 * @return {Object} A cleaned document.
 * @protected
 */
Views.prototype._sanitizeResult = function(doc) {
  if (!__.isObject(doc)) {
    return doc;
  }
  if (typeof this.opts.sanitizeResult === 'function') {
    return this.opts.sanitizeResult(doc);
  } else {
    var schema = this.entity.getSchema();
    // check for showid and override canshow
    if (this.opts.showId && schema[this.opts['idField']]) {
      schema[this.opts['idField']].canShow = true;
    }

    var sanitizedDoc = Object.create(null);
    Object.keys(schema).forEach(function(schemaKey) {
      if (schema[schemaKey].canShow) {
        sanitizedDoc[schemaKey] = doc[schemaKey];
      }
    });

    return sanitizedDoc;
  }
};

/**
 * Clean an array of items.
 *
 * @param {Array.<Object>} items Multiple Items.
 * @return {Array.<Object>} Cleaned items.
 * @protected
 */
Views.prototype._sanitizeResultArray = function(items) {
  return items.map(this._sanitizeResult, this);
};
