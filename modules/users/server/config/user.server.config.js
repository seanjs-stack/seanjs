'use strict';

/**
 * Module dependencies.
 */
var
  path = require('path'),
  passport = require('passport'),
  config = require(path.resolve('./config/config')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  User = db.user;

/**
 * Module init function.
 */
module.exports = function(app, db) {

  // Serialize sessions
  passport.serializeUser(function(user, done) {
    var userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      displayName: user.displayName,
      username: user.username,
      email: user.email,
      profileImageURL: user.profileImageURL,
      roles: user.roles,
      additionalProvidersData: user.additionalProvidersData
    };
    done(null, userData);
  });

  // Deserialize sessions
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // Initialize strategies
  config.utils.getGlobbedPaths(path.join(__dirname, './strategies/**/*.js')).forEach(function(strategy) {
    require(path.resolve(strategy))(config);
  });

  // Add passport's middleware
  app.use(passport.initialize());
  app.use(passport.session());
};