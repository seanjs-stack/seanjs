'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Article = db.article,
  User = db.user;

/**
 * Globals
 */
var user, article;

/**
 * Unit tests
 */
describe('Article Model Unit Tests:', function() {
  beforeEach(function(done) {

    user = User.build();

    user.firstName = 'Full';
    user.lastName = 'Name';
    user.displayName = 'Full Name';
    user.email = 'test@test.com';
    user.username = 'username';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword('S3@n.jsI$Aw3$0m3', user.salt);

    user.save().then(function() {
      article = Article.build({
        title: 'Article Title',
        content: 'Article Content',
        userId: user.id
      });
      done();
    }).catch(function(err) {});

  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(10000);
      article.save().then(function(err) {
        should.not.exist((err) ? null : err);
        done();
      }).catch(function(err) {});

    });

    it('should be able to show an error when try to save without title', function(done) {
      article.title = '';

      return article.save().then(function(err) {
        should.exist(null);
        done();
      }).catch(function(err) {
        should.exist(errorHandler.getErrorMessage(err));
        done();
      });

    });
  });

  afterEach(function(done) {
    //article.destroy().then(function() {
      user.destroy().then(function() {
        done();
      }).catch(function(err) {});
    //}).catch(function(err) {});
  });
});
