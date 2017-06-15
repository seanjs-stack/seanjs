'use strict';

/**
 * User Model
 */

var crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  if (((this.provider !== 'local' && !this.updated) || property.length !== 0) === false) {
    throw new Error('Local strategy failed');
  }
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
  if ((this.provider !== 'local' || (password && password.length > 6)) === false) {
    throw new Error('One field is missing');
  }
};

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
      defaultValue: '',
      validate: {
        isValid: validateLocalStrategyProperty,
        len: {
          args: [1, 30],
          msg: "First name title must be between 1 and 30 characters in length"
        },
      }
    },
    lastName: {
      type: DataTypes.STRING,
      defaultValue: '',
      validate: {
        isValid: validateLocalStrategyProperty
      }
    },
    displayName: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isUnique: function(value, next) {
          var self = this;
          User.find({
              where: {
                username: value
              }
            })
            .then(function(user) {
              // reject if a different user wants to use the same email
              if (user && self.id !== user.id) {
                return next('Username already exists, please choose another');
              }
              return next();
            })
            .catch(function(err) {
              return next(err);
            });
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isValid: validateLocalStrategyProperty,
        isEmail: {
          msg: 'Please fill a valid email address'
        },
        isUnique: function(value, next) {
          var self = this;
          User.find({
              where: {
                email: value
              }
            })
            .then(function(user) {
              // reject if a different user wants to use the same email
              if (user && self.id !== user.id) {
                return next('Email already exists, please choose another');
              }
              return next();
            })
            .catch(function(err) {
              return next(err);
            });
        }
      }
    },
    profileImageURL: DataTypes.STRING,
    roles: {
      type: DataTypes.JSON,
      defaultValue: ["user"],
      isArray: true
    },
    hashedPassword: {
      type: DataTypes.STRING,
      default: '',
      validate: {
        isValid: validateLocalStrategyPassword
      }
    },
    provider: DataTypes.STRING,
    providerData: {
      type: DataTypes.JSON
    },
    additionalProvidersData: {
      type: DataTypes.JSON
    },
    salt: DataTypes.STRING,
    resetPasswordToken: DataTypes.STRING,
    resetPasswordExpires: DataTypes.BIGINT
  }, {
    classMethods: {
      findUniqueUsername: function(username, suffix, callback) {
        var _this = this;
        var possibleUsername = username + (suffix || '');

        _this.find({
          where: {
            username: possibleUsername
          }
        }).then(function(user) {
          if (!user) {
            callback(possibleUsername);
          } else {
            return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
          }
        });
      }
    }
  });

  User.prototype.makeSalt = function() {
    return crypto.randomBytes(16).toString('base64');
  };

  User.prototype.authenticate = function(plainText) {
    return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
  };

  User.prototype.encryptPassword = function(password, salt) {
    if (!password || !salt)
      return '';
    salt = new Buffer(salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
  };

  User.associate = function(models) {
    if (models.article) {
      User.hasMany(models.article);
    }
  };

  return User;
};
