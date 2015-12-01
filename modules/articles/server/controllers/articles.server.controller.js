'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Article = db.article;

/**
 * Create a article
 */
exports.create = function(req, res) {

  req.body.userId = req.user.id;

  Article.create(req.body).then(function(article) {
    if (!article) {
      return res.send('users/signup', {
        errors: 'Could not create the article'
      });
    } else {
      return res.jsonp(article);
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Show the current article
 */
exports.read = function(req, res) {
  res.json(req.article);
};

/**
 * Update a article
 */
exports.update = function(req, res) {
  var article = req.article;

  article.updateAttributes({
    title: req.body.title,
    content: req.body.content
  }).then(function(article) {
    res.json(article);
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });
};

/**
 * Delete an article
 */
exports.delete = function(req, res) {
  var article = req.article;

  // Find the article
  Article.findById(article.id).then(function(article) {
    if (article) {

      // Delete the article
      article.destroy().then(function() {
        return res.json(article);
      }).catch(function(err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      });

    } else {
      return res.status(400).send({
        message: 'Unable to find the article'
      });
    }
  }).catch(function(err) {
    return res.status(400).send({
      message: errorHandler.getErrorMessage(err)
    });
  });

};

/**
 * List of Articles
 */
exports.list = function(req, res) {
  Article.findAll({
    include: [db.user]
  }).then(function(articles) {
    if (!articles) {
      return res.status(404).send({
        message: 'No articles found'
      });
    } else {
      res.json(articles);
    }
  }).catch(function(err) {
    res.jsonp(err);
  });
};

/**
 * Article middleware
 */
exports.articleByID = function(req, res, next, id) {

  if ((id % 1 === 0) === false) { //check if it's integer
    return res.status(404).send({
      message: 'Article is invalid'
    });
  }

  Article.find({
    where: {
      id: id
    },
    include: [{
      model: db.user
    }]
  }).then(function(article) {
    if (!article) {
      return res.status(404).send({
        message: 'No article with that identifier has been found'
      });
    } else {
      req.article = article;
      next();
    }
  }).catch(function(err) {
    return next(err);
  });

};