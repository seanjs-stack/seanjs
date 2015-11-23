'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./users/user.authentication.server.controller'),
  require('./users/user.authorization.server.controller'),
  require('./users/user.password.server.controller'),
  require('./users/user.profile.server.controller')
);