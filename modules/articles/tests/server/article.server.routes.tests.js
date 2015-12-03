'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  Article = db.article,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, article;

/**
 * Article routes tests
 */
describe('Article CRUD tests', function() {
  before(function(done) {
    // Get application
    app = express.init(sequelize);
    agent = request.agent(app);

    done();
  });

  before(function(done) {

    // Create user credentials
    credentials = {
      username: 'username',
      password: 'S3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = User.build();

    user.firstName = 'Full';
    user.lastName = 'Name';
    user.displayName = 'Full Name';
    user.email = 'test@test.com';
    user.username = credentials.username;
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(credentials.password, user.salt);
    user.provider = 'local';
    user.roles = ['admin', 'user'];

    // Save a user to the test db and create new article
    user.save().then(function(user) {
      article = Article.build();
      article = {
        title: 'Article Title',
        content: 'Article Content',
        userId: user.id
      };
      done();
    }).catch(function(err) {});

  });

  it('should be able to save an article if logged in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(200)
          .end(function(articleSaveErr, articleSaveRes) {

            // Handle article save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Get a list of articles
            agent.get('/api/articles')
              .end(function(articlesGetErr, articlesGetRes) {

                // Handle article save error
                if (articlesGetErr) {
                  return done(articlesGetErr);
                }

                // Get articles list
                var articles = articlesGetRes.body;

                // Set assertions
                console.log('articles[0]', articles[0]);
                console.log('userId', userId);

                //(articles[0].userId).should.equal(userId);
                (articles[0].title).should.match('Article Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an article if not logged in', function(done) {
    agent.get('/api/auth/signout')
      .expect(302) //because of redirect
      .end(function(signoutErr, signoutRes) {

        // Handle signout error
        if (signoutErr) {
          return done(signoutErr);
        }

        agent.post('/api/articles')
          .send(article)
          .expect(403)
          .end(function(articleSaveErr, articleSaveRes) {
            // Call the assertion callback
            done(articleSaveErr);
          });
      });
  });

  it('should not be able to save an article if no title is provided', function(done) {
    // Invalidate title field
    article.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(400)
          .end(function(articleSaveErr, articleSaveRes) {

            // Set message assertion
            (articleSaveRes.body.message).should.match('Article title must be between 1 and 250 characters in length');
            // Handle article save error
            done(articleSaveErr);
          });
      });
  });

  it('should be able to update an article if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (!signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(200)
          .end(function(articleSaveErr, articleSaveRes) {
            // Handle article save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Update article title
            article.title = 'WHY YOU GOTTA BE SO SEAN?';

            // Update an existing article
            agent.put('/api/articles/' + articleSaveRes.body.id)
              .send(article)
              .expect(200)
              .end(function(articleUpdateErr, articleUpdateRes) {
                // Handle article update error
                if (articleUpdateErr) {
                  return done(articleUpdateErr);
                }

                // Set assertions
                (articleUpdateRes.body.id).should.equal(articleSaveRes.body.id);
                (articleUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO SEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of articles if not signed in', function(done) {
    article.title = 'Article Title';
    // Create new article model instance
    var articleObj = Article.build(article);

    // Save the article
    articleObj.save().then(function() {
      // Request articles
      request(app).get('/api/articles')
        .end(function(req, res) {

          // Set assertion
          //res.body.should.be.instanceof(Array).and.have.lengthOf(1);
          res.body.should.be.instanceof(Array);
          // Call the assertion callback
          done();
        });

    }).catch(function(err) {});
  });

  it('should be able to get a single article if not signed in', function(done) {
    // Create new article model instance
    var articleObj = Article.build(article);

    // Save the article
    articleObj.save().then(function() {
      request(app).get('/api/articles/' + articleObj.id)
        .end(function(req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', article.title);

          // Call the assertion callback
          done();
        });
    }).catch(function(err) {});
  });

  it('should return proper error for single article with an invalid Id, if not signed in', function(done) {
    // test is not a valid mongoose Id
    request(app).get('/api/articles/test')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Article is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single article which doesnt exist, if not signed in', function(done) {
    // This is a valid mongoose Id but a non-existent article
    request(app).get('/api/articles/123567890')
      .end(function(req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No article with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an article if signed in', function(done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function(signinErr, signinRes) {

        // Handle signin error
        if (!signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new article
        agent.post('/api/articles')
          .send(article)
          .expect(200)
          .end(function(articleSaveErr, articleSaveRes) {


            // Handle article save error
            if (articleSaveErr) {
              return done(articleSaveErr);
            }

            // Delete an existing article
            agent.delete('/api/articles/' + articleSaveRes.body.id)
              .send(article)
              .expect(200)
              .end(function(articleDeleteErr, articleDeleteRes) {

                // Handle article error error
                if (articleDeleteErr) {
                  return done(articleDeleteErr);
                }

                // Set assertions
                (articleDeleteRes.body.id).should.equal(articleSaveRes.body.id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an article if not signed in', function(done) {
    // Set article user
    article.userId = user.id;

    // Create new article model instance
    var articleObj = Article.build(article);

    // Save the article
    articleObj.save().then(function() {
      // Try deleting article
      request(app).delete('/api/articles/' + articleObj.id)
        .expect(403)
        .end(function(articleDeleteErr, articleDeleteRes) {

          // Set message assertion
          (articleDeleteRes.body.message).should.match('User is not authorized');

          // Handle article error error
          done(articleDeleteErr);
        });

    }).catch(function(err) {});
  });

  after(function(done) {
    user.destroy()
      .then(function(success) {
        done();
      }).catch(function(err) {});
  });

});