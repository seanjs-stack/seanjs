var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var _ = require('lodash');
var config = require('../config');
var winston = require('./winston');
var db = {};


// Load the mongoose models
module.exports.loadModels = function() {
  // Globbing model files
  config.files.server.models.forEach(function(modelPath) {
    require(path.resolve(modelPath));
  });
};

module.exports.connect = function(cb) {
  winston.info('Initializing Sequelize...');

  // create your instance of sequelize
  var sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres', //mysql, postgres, sqlite3,...
    storage: config.db.storage,
    logging: config.enableSequelizeLog ? winston.verbose : false
  });

  // import model files and save model names
  config.files.server.models.forEach(function(file) {
    winston.info('Loading model file ' + file);
    var model = sequelize.import(path.resolve(file));
    db[model.name] = model;
  });

  // invoke associations on each of the models
  Object.keys(db).forEach(function(modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
      db[modelName].options.associate(db)
    }
  });


  // Synchronizing any model changes with database. 
  // WARNING: this will DROP your database everytime you re-run your application
  sequelize
    .sync({
      force: config.forceSequelizeSync
    })
    .then(function() {
      winston.info("Database " + (config.forceSequelizeSync ? "*DROPPED* and " : "") + "synchronized");
    }).catch(function(err) {
      winston.error("An error occured: %j", err);
    });

  // assign the sequelize variables to the db object and returning the db. 
  // module.exports = _.extend({
  //   sequelize: sequelize,
  //   Sequelize: Sequelize
  // }, db);
  if (cb) cb(db);
}