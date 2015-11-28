'use strict';

module.exports = function(app) {
  // User Routes
  var user = require('../controllers/user.server.controller');

  // Setting up the users profile api
  app.route('/api/user/me').get(user.requiresLogin, user.me);
  app.route('/api/user')
    .get(user.requiresLogin, user.getProfile)
    .put(user.requiresLogin, user.update);
  app.route('/api/user/accounts').delete(user.requiresLogin, user.removeOAuthProvider);
  app.route('/api/user/password').post(user.requiresLogin, user.changePassword);
  app.route('/api/user/picture').post(user.requiresLogin, user.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', user.userByID);
};
