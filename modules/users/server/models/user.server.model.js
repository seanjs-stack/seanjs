'use strict';

/**
 * User Model
 */

var crypto = require('crypto');

Array.prototype.contains = function(element) {
  return this.indexOf(element) > -1;
};

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
      type: (sequelize.options.dialect === 'postgres') ? DataTypes.JSON : DataTypes.STRING,
      defaultValue: ["user"],
      isArray: true,
      validate: {
        //len: [1, 99], // the array has to be at least three and max 99 elements long
        isVaidRole: function(role) {
          // if (!role) throw new Error("Role cannot be empty");
          //
          //
          // var nrole = ['user', 'admin'];
          // var validRoles = ['admin', 'user', 'guest'];
          //
          // if (nrole.length <= validRoles.length) {
          //   if (nrole.length === 1 && validRoles.indexOf(nrole) < 0) {
          //     throw new Error("Invalid roles 1");
          //   } else if (nrole.length > 1 && !validRoles.contains(nrole)) {
          //     throw new Error("Invalid roles 2");
          //   } else if (nrole.length === validRoles.length && validRoles.sort().toString() !== nrole.sort().toString()) {
          //     throw new Error("Invalid roles 2");
          //   } else {
          //     throw new Error("Invalid roles 3");
          //   }
          // } else {
          //   throw new Error("Invalid roles 4");
          // }

        }
      }
    },
    hashedPassword: {
      type: DataTypes.STRING,
      default: '',
      validate: {
        isValid: validateLocalStrategyPassword
      }
    },
    provider: DataTypes.STRING,
    providerData: (sequelize.options.dialect === 'postgres') ? DataTypes.JSON : DataTypes.TEXT,
    additionalProvidersData: (sequelize.options.dialect === 'postgres') ? DataTypes.JSON : DataTypes.TEXT,
    salt: DataTypes.STRING,
    facebookUserId: DataTypes.INTEGER,
    twitterUserId: DataTypes.INTEGER,
    twitterKey: DataTypes.STRING,
    twitterSecret: DataTypes.STRING,
    github: DataTypes.STRING,
    openId: DataTypes.STRING,
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