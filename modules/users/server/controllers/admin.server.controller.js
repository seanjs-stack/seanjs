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

  User.find({
    where: {
      id: req.model.id
    }
  }).then(function(user) {
    if (user) {

      user.firstName = req.body.firstName;
      user.lastName = req.body.lastName;
      user.displayName = req.body.firstName + ' ' + req.body.lastName;
      user.username = req.body.username;
      user.email = req.body.email;
      user.roles = req.body.roles;
      user.updatedAt = Date.now();

      user.save().then(function() {
        res.json(user);
      }).catch(function(err) {
        res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Could not find user'
      });
    }
  }).catch(function(err) {
    res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * Delete a user
 */
exports.delete = function(req, res) {

  if (req.user.id === req.model.id) {
    return res.status(400).send({
      message: 'You cannot delete yourself!'
    });
  } else {
    User.find({
      where: {
        id: req.model.id
      }
    }).then(function(user) {
      if (user) {
        user.destroy().then(function() {
          return res.json(user);
        }).catch(function(err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        });
      }
    });
  }


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
        message: 'Unable to get list of users'
      });
    } else {
      res.json(users);
    }
  }).catch(function(err) {
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

      var data = {};

      data.id = user.id;
      data.firstName = user.firstName;
      data.lastName = user.lastName;
      data.displayName = user.displayName;
      data.email = user.email;
      data.username = user.username;
      data.roles = user.roles;
      data.provider = user.provider;
      data.updatedAt = user.updatedAt;
      data.createdAt = user.createdAt;

      req.model = data;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};