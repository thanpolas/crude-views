/**
 * @fileOverview A repository for actions, use when time to integrate...
 */


// Create
//
// res.redirect(self.base.getBaseUrl(req) + '/' +
//   doc[self.base.opts.urlField]);
//
//
//
//



/**
 * Create an item view.
 *
 * @param {Object} req The request Object.
 * @param {Object} res The response Object.
 */
// Create.prototype.createView = function(req, res) {
//   if (this.base.opts.noViews) {
//     return res.status(401).json(this.base.jsonError('Wrong turn'));
//   }
//   this.base.checkFlashError(req, res);
//   this.base.checkFlashSuccess(req, res);
//   res.render(this.base.opts.editView);
// };


// Delete
//
// self.base.addSuccess(res);
// res.redirect(self.base.getBaseUrl(req, true));
//
// Delete fail:
// self.base.addFlashError(req, err);
//   res.redirect(self.base.getBaseUrl(req, true));


// Read
//
// res.locals.items = results;
// res.locals.count = results.length;
// self._readListResults(req, res);

// Read Results
  // if (this.base.opts.listView) {
  //   return res.render(this.base.opts.listView);
  // }

  // // render the template and store in response locals.
  // res.locals[Read.VIEW_OUTPUT_KEY] = this.base.compiled.list(res.locals);
  // if (this.base.opts.layoutView) {
  //   res.render(this.base.opts.layoutView);
  // } else {
  //   res.send(res.locals[Read.VIEW_OUTPUT_KEY]);
  // }

// Read Error
    // this.base.addError(res, err);
    // res.render(view);

// Update View:

/**
 * Show single item update view
 *
 * @param {Object} req The request Object.
 * @param {Object} res The response Object.
 */
// Update.prototype.updateView = Promise.method(function(req, res) {
//   if (this.base.opts.noViews) {
//     return res.status(401).json(this.base.jsonError('Wrong turn'));
//   }

//   if (!this.base.opts.editView) {
//     var errMsg = 'Not implemented. Define "editView" parameter.';
//     res.send(errMsg);
//     throw new Error(errMsg);
//   }

//   var self = this;

//   // attempt to fetch the record...
//   var query = new Object(null);
//   query[this.base.opts.urlField] = req.params.id;
//   if (this.base.opts.ownUser) {
//     query[this.base.opts.ownUserSchemaProperty] = req[this.base.opts.ownUserRequestProperty];
//   }

//   return this.base.entity.readOne(query).then(function(doc) {
//     if (!doc) {
//       throw new Error('Network not found, id: ' + req.params.id);
//     }

//     // assign the item to the tpl vars.
//     res.locals.item = doc;
//     // construct the item's url
//     var itemUrl = path.join(self.base.getBaseUrl(req, true),
//       doc[self.base.opts.urlField]);
//     res.locals.opts.itemUrl = path.normalize(itemUrl) + '/';
//     self.base.checkFlashError(req, res);
//     res.render(self.base.opts.editView);
//   }).catch(function(err) {
//     self.base.addError(res, err);
//     res.render(self.base.opts.editView);
//     throw err;
//   });
// });


// Read pagination
    // res.locals.pagination = paginator.render();
    // res.locals.items = items;
    // res.locals.count = count;
