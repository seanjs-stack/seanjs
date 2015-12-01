"use strict";

module.exports = function(sequelize, DataTypes) {

  var Article = sequelize.define('article', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [1, 250],
          msg: "Article title must be between 1 and 250 characters in length"
        },
      }
    },
    content: DataTypes.TEXT
  }, {
    associate: function(models) {
      Article.belongsTo(models.user);
    }
  });
  return Article;
};