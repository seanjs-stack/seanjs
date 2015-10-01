module.exports = function(sequelize, DataTypes) {

	var Article = sequelize.define('article', {
		title: DataTypes.STRING,
		content: DataTypes.TEXT
	}, {
		associate: function(models) {
			Article.belongsTo(models.user);
		}
	});
	return Article;
};