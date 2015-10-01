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
        isValid: validateLocalStrategyProperty
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
      defaultValue: '',
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
    roles: (sequelize.options.dialect == 'postgres') ? DataTypes.JSON : DataTypes.STRING,
    hashedPassword: {
      type: DataTypes.STRING,
      default: '',
      validate: {
        isValid: validateLocalStrategyPassword
      }
    },
    provider: DataTypes.STRING,
    providerData: (sequelize.options.dialect == 'postgres') ? DataTypes.JSON : DataTypes.TEXT,
    additionalProvidersData: (sequelize.options.dialect == 'postgres') ? DataTypes.JSON : DataTypes.TEXT,
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
        if (!password || !salt) return '';
        salt = new Buffer(salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
      }
    },
    classMethods: {
      findUniqueUsername: function(username, suffix, callback) {
        var _this = this;
        var possibleUsername = username + (suffix || '');

        _this.find({
          username: possibleUsername
        }).done(function(err, user) {
          if (!err) {
            if (!user) {
              callback(possibleUsername);
            } else {
              return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
          } else {
            callback(null);
          }
        });
      }
    },
    associate: function(models) {
      User.hasMany(models.article);
    }
  });

  return User;
};