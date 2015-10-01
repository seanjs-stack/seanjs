"use strict";

var path = require("path"),
  Sequelize = require("sequelize"),
  winston = require('winston'),
  db = {};

db.Sequelize = Sequelize;
db.models = {};
db.discover = [];

// Define default logger function
db.logger = function(log) {
  console.log(log);
};

// Expose the connection function
db.connect = function(database, username, password, options) {

  if (typeof db.logger === 'function')
    db.logger("Connecting to: " + database + " as: " + username);

  // Instantiate a new sequelize instance
  var sequelize = new db.Sequelize(database, username, password, options);


  db.discover.forEach(function(location) {
    var model = sequelize["import"](location);
    if (model)
      db.models[model.name] = model;
  });

  // Execute the associate methods for each Model
  Object.keys(db.models).forEach(function(modelName) {
    if (db.models[modelName].options.hasOwnProperty('associate')) {
      db.models[modelName].options.associate(db.models);
      if (typeof db.logger === 'function')
        db.logger("Associating Model: " + modelName);
    }
  });

  // Synchronizing any model changes with database. 
  // WARNING: this will DROP your database everytime you re-run your application
  sequelize.sync()
    .then(function() {
      winston.info("Database synchronized");
    }).catch(function(err) {
      winston.error("An error occured: %j", err);
    });

  db.sequelize = sequelize;

  if (typeof db.logger === 'function')
    db.logger("Finished Connecting to Database");

  return true;
};

module.exports = db;