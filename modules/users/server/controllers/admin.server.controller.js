'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  User = db.user;


/**
 * Show the current user
 */
exports.read = function(req, res) {
  res.json(req.model);
};

/**
 * Update a User
 */
exports.update = function(req, res) {
  var user = req.model;

  //For security purposes only merge these parameters
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.displayName = user.firstName + ' ' + user.lastName;
  user.roles = req.body.roles;

  user.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * Delete a user
 */
exports.delete = function(req, res) {
  var user = req.model;

  user.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(user);
  });
};

/**
 * List of Users
 */
exports.list = function(req, res) {
  User.findAll({
    order: [
      ['createdAt', 'DESC']
    ]
  }).then(function(users) {
    if (!users) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(users);
    }
  }).catch(function(err) {
    console.log('err', err);
    res.jsonp(err);
  });
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
  if (!id) {
    return res.status(400).send({
      message: 'User is invalid'
    });
  }

  User.findById(id).then(function(user) {
    if (!user) {
      return next(new Error('Failed to load user ' + id));
    } else {
      req.model = user;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

  // User.findById(id, '-salt -password').exec(function(err, user) {
  //   if (err) {
  //     return next(err);
  //   } else if (!user) {
  //     return next(new Error('Failed to load user ' + id));
  //   }

  //   req.model = user;
  //   next();
  // });
};