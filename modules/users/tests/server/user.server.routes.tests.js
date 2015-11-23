'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  sequelize = require(path.resolve('./config/lib/sequelize-connect')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  User = db.user,
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, _user, admin;

/**
 * User routes tests
 */
describe('User CRUD tests', function() {
  before(function(done) {
    // Get application
    app = express.init(sequelize);
    agent = request.agent(app);

    done();
  });

  beforeEach(function(done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'S3@n.jsI$Aw3$0m3'
    };

    // Create a new user

    var _user = User.build();

    _user.firstName = 'Full';
    _user._user.lastName = 'Name';
    _user.displayName = 'Full Name';
    _user.email = 'test@test.com';
    _user.username = credentials.username;
    _user.provider = 'local';
    _user.roles = ["admin", "user"];
    _user.salt = _user.makeSalt();
    _user.hashedPassword = _user.encryptPassword(credentials.password, _user.salt);

    // Save a user to the test db and create new article
    _user.save().then(function(err) {
      should.not.exist((err) ? null : 'false');
      done();
    }).catch(function(err) {});
  });

  /* TODO
    it('should be able to register a new user', function(done) {

      _user.username = 'register_new_user';
      _user.email = 'register_new_user_@test.com';

      agent.post('/api/auth/signup')
        .send(_user)
        .expect(200)
        .end(function(signupErr, signupRes) {
          // Handle signpu error
          if (signupErr) {
            console.log('signupErr', signupErr);
            return done(signupErr);
          }

          signupRes.body.username.should.equal(_user.username);
          signupRes.body.email.should.equal(_user.email);
          // Assert a proper profile image has been set, even if by default
          signupRes.body.profileImageURL.should.not.be.empty();
          // Assert we have just the default 'user' role
          signupRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
          signupRes.body.roles.indexOf('user').should.equal(0);
          return done();
        });
    });
  */

  /* TODO
    it('should be able to login successfully and logout successfully', function(done) {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Logout
          agent.get('/api/auth/signout')
            .expect(302)
            .end(function(signoutErr, signoutRes) {
              if (signoutErr) {
                return done(signoutErr);
              }

              signoutRes.redirect.should.equal(true);
              signoutRes.text.should.equal('Moved Temporarily. Redirecting to /');
              return done();
            });
        });
    });
  */

  /* TODO
    it('should not be able to retrieve a list of users if not admin', function(done) {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function(signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Request list of users
          agent.get('/api/users')
            .expect(403)
            .end(function(usersGetErr, usersGetRes) {
              if (usersGetErr) {
                return done(usersGetErr);
              }

              return done();
            });
        });
    });
  */

  /* TODO
    it('should be able to retrieve a list of users if admin', function(done) {
      user.roles = ['user', 'admin'];

      user.save(function(err) {
        should.not.exist(err);
        agent.post('/api/auth/signin')
          .send(credentials)
          .expect(200)
          .end(function(signinErr, signinRes) {
            // Handle signin error
            if (signinErr) {
              return done(signinErr);
            }

            // Request list of users
            agent.get('/api/users')
              .expect(200)
              .end(function(usersGetErr, usersGetRes) {
                if (usersGetErr) {
                  return done(usersGetErr);
                }

                usersGetRes.body.should.be.instanceof(Array).and.have.lengthOf(1);

                // Call the assertion callback
                return done();
              });
          });
      });
    });
  */

  /* TODO
    it('should be able to get a single user details if admin', function(done) {
      user.roles = ['user', 'admin'];

      user.save(function(err) {
        should.not.exist(err);
        agent.post('/api/auth/signin')
          .send(credentials)
          .expect(200)
          .end(function(signinErr, signinRes) {
            // Handle signin error
            if (signinErr) {
              return done(signinErr);
            }

            // Get single user information from the database
            agent.get('/api/users/' + user.id)
              .expect(200)
              .end(function(userInfoErr, userInfoRes) {
                if (userInfoErr) {
                  return done(userInfoErr);
                }

                userInfoRes.body.should.be.instanceof(Object);
                userInfoRes.body.id.should.be.equal(String(user.id));

                // Call the assertion callback
                return done();
              });
          });
      });
    });
  */

  /* TODO
    it('should be able to update a single user details if admin', function(done) {
      user.roles = ['user', 'admin'];

      user.save().then(function(err) {
        should.not.exist(err);
        agent.post('/api/auth/signin')
          .send(credentials)
          .expect(200)
          .end(function(signinErr, signinRes) {
            // Handle signin error
            if (signinErr) {
              return done(signinErr);
            }

            // Get single user information from the database

            var userUpdate = {
              firstName: 'admin_update_first',
              lastName: 'admin_update_last',
              roles: ['admin']
            };

            agent.put('/api/users/' + user.id)
              .send(userUpdate)
              .expect(200)
              .end(function(userInfoErr, userInfoRes) {
                if (userInfoErr) {
                  return done(userInfoErr);
                }

                userInfoRes.body.should.be.instanceof(Object);
                userInfoRes.body.firstName.should.be.equal('admin_update_first');
                userInfoRes.body.lastName.should.be.equal('admin_update_last');
                userInfoRes.body.roles.should.be.instanceof(Array).and.have.lengthOf(1);
                userInfoRes.body.id.should.be.equal(String(user.id));

                // Call the assertion callback
                return done();
              });
          });
      }).catch(function(err) {});
    });
    */

  /* TODO
    it('should be able to delete a single user if admin', function(done) {
      user.roles = ['user', 'admin'];

      user.save().then(function(err) {
        should.not.exist(err);
        agent.post('/api/auth/signin')
          .send(credentials)
          .expect(200)
          .end(function(signinErr, signinRes) {
            // Handle signin error
            if (signinErr) {
              return done(signinErr);
            }

            agent.delete('/api/users/' + user.id)
              //.send(userUpdate)
              .expect(200)
              .end(function(userInfoErr, userInfoRes) {
                if (userInfoErr) {
                  return done(userInfoErr);
                }

                userInfoRes.body.should.be.instanceof(Object);
                userInfoRes.body.id.should.be.equal(String(user.id));

                // Call the assertion callback
                return done();
              });
          });
      }).catch(function(err) {});
    });
    */

  afterEach(function(done) {
    _user.destroy().then(function() {
      done();
    }).catch(function(err) {});
  });
});