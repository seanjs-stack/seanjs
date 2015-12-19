'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  express = require('./express'),
  chalk = require('chalk'),
  sequelize = require('./sequelize-connect'),
  winston = require('./winston');


module.exports.init = function init(callback) {
  var app = express.init(sequelize);
  if (callback) callback(app, sequelize, config);
};

module.exports.start = function start(callback) {
  winston.info('Initializing SEAN.JS Stack...');

  var _this = this;

  _this.init(function(app, db, config) {

    // Start the app by listening on <port>
    app.listen(config.port, function() {

      // Logging initialization
      console.log('--------------------------');
      console.log(chalk.green(config.app.title));
      console.log(chalk.green('Environment:\t\t') + process.env.NODE_ENV);
      console.log(chalk.green('Port:\t\t\t') + config.port);
      console.log(chalk.green('Database:\t\t') + config.db.name);
      if (config.secure && config.secure.ssl === true) {
        console.log(chalk.green('SSL:\t\t\tON'));
      }
      console.info(chalk.green('App version:\t\t') + config.seanjs.version);

      if (config.seanjs['seanjs-version']) {
        console.log(chalk.green('SEAN.JS version:\t') + config.seanjs['seanjs-version']);
      }

      console.info(chalk.green('App URL:\t\t') + (process.env.NODE_HOST || 'localhost') + ":" + config.port);

      console.log('--------------------------');


      if (!config.app.reCaptchaSecret) {
        winston.warn('Missing reCaptcha Secret in env!');
      }

      if (callback) callback(app, db, config);
    });

  });

};