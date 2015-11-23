'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  path = require('path'),
  db = require(path.resolve('./config/lib/sequelize')).models,
  User = db.user;

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  if (!id) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }
  User.findOne({
    where: {
      id: id
    }
  }).then(function(user) {
    if (!user) {
      return next(new Error('Failed to load User ' + id));
    }
    req.profile = user;
    next();
  });
};


exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(401).send({
      message: 'User is not logged in'
    });
  }
  next();
};

exports.hasAuthorization = function(roles) {
  var _this = this;
  return function(req, res, next) {
    _this.requiresLogin(req, res, function() {
      if (_.intersection(req.user.roles, roles).length) {
        return next();
      } else {
        return res.status(403).send({
          message: 'User is not authorized'
        });
      }
    });
  };
};