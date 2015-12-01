'use strict';

var
  path = require('path'),
  config = require(path.resolve('./config/config')),
  redisInstance = require('redis').createClient(config.redis.port, config.redis.host, {
    no_ready_check: true
  }),
  acl = require('acl');

/**
 * Module dependencies.
 */

// Using the redis backend

//Use redis database 1
redisInstance.select(1);

if (config.redis.password) {
  redisInstance.auth(config.redis.password);
}

acl = new acl(new acl.redisBackend(redisInstance, 'acl'));

/**
 * Invoke Admin Permissions
 */
exports.invokeRolesPolicies = function() {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/admin/user',
      permissions: '*'
    }, {
      resources: '/api/admin/user/:userId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Admin Policy Allows
 */
exports.isAllowed = function(req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
    if (err) {
      // An authorization error occurred.
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};