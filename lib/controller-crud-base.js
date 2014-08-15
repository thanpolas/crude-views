/**
 * @fileOverview The base Controller Class.
 */
var __  = require('lodash');
var crude = require('crude');

var tplHelpers = require('./tpl-helpers.js');

/**
 * Extend and augment the crude controller.
 *
 * @extends {crude.CrudeBaseCtrl}
 * @constructor
 */
var Controller = module.exports = crude.extend(function() {
  // define CRUD handlers
  this.create.unshift(this._prepResponse.bind(this));
  this.readOne.unshift(this._prepResponse.bind(this));
  this.update.unshift(this._prepResponse.bind(this));

  this.createView = [
    this._prepResponse.bind(this),
    this.createOp.createView.bind(this.createOp),
  ];
  this.updateView = [
    this._prepResponse.bind(this),
    this.updateOp.updateView.bind(this.updateOp),
  ];
});

/** @define {string} The view key in which the output will be available.  */
Controller.VIEW_OUTPUT_KEY = 'crudView';


/**
 * Check if an error was passed through session flash.
 *
 * @param {Object} req The request Object.
 * @param {express.Result} res Express response object.
 */
Controller.prototype.checkFlashError = function(req, res) {
  res.locals.error =  !!req.flash('error').shift();
  if (res.locals.error) {
    var errObj = req.flash('errorObj').shift();
    if (!(errObj instanceof Object)) {
      errObj = {};
    }
    res.locals.errorMsg = req.flash('errorMsg').shift();
    res.locals.errorObj = errObj;
  }
};

/**
 * Check if an success message was passed through session flash.
 *
 * @param {Object} req The request Object.
 * @param {express.Result} res Express response object.
 */
Controller.prototype.checkFlashSuccess = function(req, res) {
  res.locals.success =  !!req.flash('success').shift();
  if (res.locals.success) {
    var successObj = req.flash('successObj').shift();
    if (!(successObj instanceof Object)) {
      successObj = {};
    }
    res.locals.successObj = successObj;
  }
};


/**
 * Add an Error instance to the view params.
 *
 * @param {express.Result} res Express response object.
 * @param {Error} err an instance or child of Error.
 */
Controller.prototype.addError = function(res, err) {
  res.locals.error =  true;
  res.locals.errorMsg = err.message;
  res.locals.errorObj = err;
};

/**
 * Add success message to the view params.
 *
 * @param {express.Result} res Express response object.
 * @param {Object=} obj Any Object.
 */
Controller.prototype.addSuccess = function(res, optObj) {
  res.locals.success =  true;
  res.locals.successObj = optObj || {};
};

/**
 * Add the error to the session flash.
 *
 * @param {Object} req The request Object.
 * @param {Error} err an instance or child of Error.
 */
Controller.prototype.addFlashError = function(req, err) {
  req.flash('error', true);
  req.flash('errorMsg', err.message);
  req.flash('errorObj', err);
};



/**
 * Add the success message / object to the session flash.
 *
 * @param {Object} req The request Object.
 * @param {Object=} obj Any Object.
 */
Controller.prototype.addFlashSuccess = function(req, obj) {
  req.flash('success', true);
  req.flash('successObj', obj);
};

/**
 * Prepare the response object for each request, an internal middleware.
 *
 * @param {Object} req The request Object.
 * @param {Object} res The response Object.
 * @param {Function} next callback.
 * @protected
 */
Controller.prototype._prepResponse = function(req, res, next) {
  res.locals.opts = Object.create(this.opts);
  res.locals.opts.renderedBaseUrl = this.getBaseUrl(req);
  res.locals.schema = this.entity.getSchema();
  res.locals.currentUser = req.user;
  // all template functions
  res.locals.fn = {};
  __.extend(res.locals.fn, tplHelpers);
  next();
};

/**
 * Handle a successful outcome by either rendering or JSONing.
 *
 * @param {Object} req The request Object.
 * @param {Object} res The response Object.
 * @param {Object} doc The document item.
 * @private
 */
Controller.prototype._handleSuccess = function(req, res, doc) {
  // assign the item to the tpl vars.
  res.locals.item = doc;
  // construct the item's url
  // var itemUrl = path.join(this.getBaseUrl(req, true), doc[this.opts.urlField]);
  // res.locals.item.itemUrl = path.normalize(itemUrl) + '/';

  this.checkFlashSuccess(req, res);

  if (this.opts.itemView) {
    return res.render(this.opts.itemView);
  }

  // render the template and store in response locals.
  res.locals[Controller.VIEW_OUTPUT_KEY] = this.compiled.view(res.locals);

  var status = 200;
  if (!doc) {
    status = 404;
  }
  if (this.opts.layoutView) {
    res.status(status).render(this.opts.layoutView);
  } else {
    res.status(status).send(res.locals[Controller.VIEW_OUTPUT_KEY]);
  }
};

/**
 * Handle an success outcome properly depending on request Content-Type
 *
 * @param {Object} req The request Object.
 * @param {Object} res The response Object.
 * @param {Object} doc A document.
 * @private
 */
Controller.prototype._handleSuccessRedirect = function(req, res, doc) {
  res.status(200).json(this._sanitizeResult(doc));
  res.redirect(this.getBaseUrl(req, true) + '/' + doc[this.opts.urlField]);
};

/**
 * Handle an error properly depending on request Content-Type
 *
 * @param {Object} req The request Object.
 * @param {Object} res The response Object.
 * @param {string} redirectUrl Define a redirect url.
 * @param {Error} err Error.
 * @protected
 */
Controller.prototype._handleErrorRedirect = function(req, res, redirectUrl, err) {
  this.addFlashError(req, err);
  res.redirect(redirectUrl);
};
