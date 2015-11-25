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
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Please fill a valid email address'
        },
        isValid: validateLocalStrategyProperty
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
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
    instanceMethods: {
      makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
      },
      authenticate: function(plainText) {
        return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
      },
      encryptPassword: function(password, salt) {
        if (!password || !salt)
          return '';
        salt = new Buffer(salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
      }
    },
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
    },
    associate: function(models) {
      if (models.article) {
        User.hasMany(models.article, {
          onDelete: 'cascade',
          hooks: true
        });
      }
    }
  });

  return User;
};