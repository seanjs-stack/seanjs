'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  db = require(path.resolve('./config/lib/sequelize')).models,
  User = db.user;

/**
 * Globals
 */
var user1, user2, user3;

/**
 * Unit tests
 */
describe('User Model Unit Tests:', function() {

  before(function() {

    user1 = User.build();

    user1.firstName = 'Full';
    user1.lastName = 'Name';
    user1.displayName = 'Full Name';
    user1.email = 'test@test.com';
    user1.username = 'username';
    user1.provider = 'local';
    user1.roles = ["user"];
    user1.salt = user1.makeSalt();
    user1.hashedPassword = user1.encryptPassword('S3@n.jsI$Aw3$0m3', user1.salt);

    // user2 is a clone of user1
    user2 = user1;

    user3 = User.build();

    user3.firstName = 'Different';
    user3.lastName = 'User';
    user3.displayName = 'Full Different Name';
    user3.email = 'test3@test.com';
    user3.username = 'different_username';
    user3.provider = 'local';
    user3.roles = ["guest"];
    user3.salt = user3.makeSalt();
    user3.hashedPassword = user3.encryptPassword('Different_Password1', user3.salt);

  });

  describe('Method Save', function() {

    // TODO
    // it('should begin with no users', function(done) {
    //   User.find({}).then(function(users) {
    //     users.should.have.length(0);
    //     done();
    //   }).catch(function(err) {});
    // });

    it('should be able to save without problems', function(done) {
      user1.save().then(function(success) {
        should.not.exist((success) ? null : success);
        user1.destroy().then(function(success) {
          should.not.exist((success) ? null : success);
          done();
        }).catch(function(err) {});
      }).catch(function(err) {});
    });

    it('should fail to save an existing user again', function(done) {
      user1.save().then(function(success) {
        should.exist('Shoud not save the user');
        user2.save().then(function(success) {
          should.exist('Shoud not save the user');
          user1.destroy().then(function(success) {
            done();
          }).catch(function(err) {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
          });
        }).catch(function(err) {
          done();
        });
      }).catch(function(err) {
        done();
      });
    });

    it('should be able to show an error when trying to save without first name', function(done) {
      user1.firstName = '';
      user1.save().then(function(success) {
        should.exist('Shoud not save the title');
      }).catch(function(err) {
        done();
      });
    });

    it('should be able to update an existing user with valid roles without problems', function(done) {
      user1.firstName = 'Test User';
      user1.roles = ['admin', 'user'];
      user1.save().then(function(success) {
        should.not.exist((success) ? null : success);
        user1.destroy().then(function(success) {
          should.not.exist((success) ? null : success);
          done();
        }).catch(function(err) {});
      }).catch(function(err) {});
    });

    it('should be able to show an error when trying to update an existing user without a role', function(done) {
      user1.save().then(function(err) {
        should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
        user1.roles = [];
        user1.save().then(function(err) {
          should.exist((err) ? err : null);
          user1.destroy().then(function(err) {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            done();
          }).catch(function(err) {});
        }).catch(function(err) {});
      }).catch(function(err) {});
    });

    // TODO
    // it('should be able to show an error when trying to update an existing user with a invalid role', function(done) {
    //   user1.save().then(function(success) {
    //     should.not.exist((success) ? null : errorHandler.getErrorMessage(success));
    //     user1.roles = ['invalid-user-role-enum'];
    //     user1.save().then(function(err) {
    //       console.log('err', err);
    //       should.exist((err) ? err : null);
    //       user1.destroy().then(function(err) {
    //         should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
    //         done();
    //       }).catch(function(err) {});
    //     }).catch(function(err) {});
    //   }).catch(function(err) {});
    // });

    it('should confirm that saving user model doesnt change the password', function(done) {
      user1.save().then(function(err) {
        should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
        var passwordBefore = user1.hashedPassword;
        user1.firstName = 'test';
        user1.save().then(function(err) {
          var passwordAfter = user1.hashedPassword;
          passwordBefore.should.equal(passwordAfter);
          user1.destroy().then(function(err) {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            done();
          }).catch(function(err) {});
        }).catch(function(err) {});
      }).catch(function(err) {});
    });

    it('should be able to save 2 different users', function(done) {
      user1.save().then(function(err) {
        should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
        user3.save().then(function(err) {
          should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
          user3.destroy().then(function(err) {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            user1.destroy().then(function(err) {
              should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
              done();
            }).catch(function(err) {});
          }).catch(function(err) {});
        }).catch(function(err) {});
      }).catch(function(err) {});
    });


    //TODO NOT WORKING
    it('should not be able to save another user with the same email address', function(done) {
      // Test may take some time to complete due to db operations
      this.timeout(10000);
      user1.save().then(function(err) {
        should.not.exist((err) ? null : 'yes');
        user3.email = user1.email;
        user3.save().then(function(err) {
          should.exist((err) ? 'false' : null);
          user1.destroy().then(function(err) {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            done();
          }).catch(function(err) {});
        }).catch(function(err) {});
      }).catch(function(err) {});

    });

    // TODO
    // it('should not save the password in plain text', function(done) {
    //   var passwordBeforeSave = user1.hashedPassword;
    //   user1.save().then(function(err) {
    //     should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
    //     user1.hashedPassword.should.not.equal(passwordBeforeSave);
    //     user1.destroy().then(function(err) {
    //       should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
    //       done();
    //     }).catch(function(err) {});
    //   }).catch(function(err) {});
    // });

    // TODO
    // it('should not save the passphrase in plain text', function(done) {
    //   var password = 'Open-Source Full-Stack Solution for SEANJS';
    //
    //   user1.salt = user1.makeSalt();
    //   user1.hashedPassword = user1.encryptPassword(password, user1.salt);
    //
    //   var passwordBeforeSave = user1.hashedPassword;
    //   user1.save().then(function(err) {
    //     should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
    //     user1.hashedPassword.should.not.equal(passwordBeforeSave);
    //     user1.destroy().then(function(err) {
    //       should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
    //       done();
    //     }).catch(function(err) {});
    //   }).catch(function(err) {});
    // });

  });
  /* TODO
    describe("User Password Validation Tests", function() {
      it('should validate when the password strength passes - "P@$$w0rd!!"', function() {
        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword('P@$$w0rd!!', user1.salt);

        user1.validate().success(function(err) {
          should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
        }).catch(function(err) {});
      });

      it('should validate when the password is undefined', function() {
        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword(undefined, user1.salt);

        user1.validate().success(function(err) {
          should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
        }).catch(function(err) {});
      });

      it('should validate when the passphrase strength passes - "Open-Source Full-Stack Solution For SEANJS Applications"', function() {
        var password = 'Open-Source Full-Stack Solution For SEANJS Applications';

        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword(password, user1.salt);

        user1.validate().success(function(err) {
          should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
        }).catch(function(err) {});
      });

      it('should not allow a less than 10 characters long - "P@$$w0rd!"', function(done) {
        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword('P@$$w0rd!', user1.salt);

        user1.validate().success(function(err) {
          err.errors.password.message.should.equal("The password must be at least 10 characters long.");
          done();
        }).catch(function(err) {});
      });

      it('should not allow a greater than 128 characters long.', function(done) {
        var password = ')!/uLT="lh&:`6X!]|15o!$!TJf,.13l?vG].-j],lFPe/QhwN#{Z<[*1nX@n1^?WW-%_.*D)m$toB+N7z}kcN#B_d(f41h%w@0F!]igtSQ1gl~6sEV&r~}~1ub>If1c+';

        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword(password, user1.salt);

        user1.validate().success(function(err) {
          err.errors.password.message.should.equal("The password must be fewer than 128 characters.");
          done();
        }).catch(function(err) {});
      });

      it('should not allow more than 3 or more repeating characters - "P@$$w0rd!!!"', function(done) {
        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword('P@$$w0rd!!!', user1.salt);

        user1.validate().success(function(err) {
          err.errors.password.message.should.equal("The password may not contain sequences of three or more repeated characters.");
          done();
        }).catch(function(err) {});
      });

      it('should not allow a password with no uppercase letters - "p@$$w0rd!!"', function(done) {
        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword('p@$$w0rd!!', user1.salt);

        user1.validate().success(function(err) {
          err.errors.password.message.should.equal("The password must contain at least one uppercase letter.");
          done();
        }).catch(function(err) {});
      });

      it('should not allow a password with less than one number - "P@$$word!!"', function(done) {
        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword('P@$$word!!', user1.salt);

        user1.validate().success(function(err) {
          err.errors.password.message.should.equal("The password must contain at least one number.");
          done();
        }).catch(function(err) {});
      });

      it('should not allow a password with less than one special character - "Passw0rdss"', function(done) {
        user1.salt = user1.makeSalt();
        user1.hashedPassword = user1.encryptPassword('Passw0rdss', user1.salt);

        user1.validate().success(function(err) {
          err.errors.password.message.should.equal("The password must contain at least one special character.");
          done();
        }).catch(function(err) {});
      });
    });
  */
  /* TODO
    describe("User E-mail Validation Tests", function() {
      it('should not allow invalid email address - "123"', function(done) {
        user1.email = '123';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should not allow invalid email address - "123@123"', function(done) {
        user1.email = '123@123';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should not allow invalid email address - "123.com"', function(done) {
        user1.email = '123.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should not allow invalid email address - "@123.com"', function(done) {
        user1.email = '@123.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should not allow invalid email address - "abc@abc@abc.com"', function(done) {
        user1.email = 'abc@abc@abc.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should not allow invalid characters in email address - "abc~@#$%^&*()ef=@abc.com"', function(done) {
        user1.email = 'abc~@#$%^&*()ef=@abc.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should not allow space characters in email address - "abc def@abc.com"', function(done) {
        user1.email = 'abc def@abc.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should not allow doudble quote characters in email address - "abc\"def@abc.com"', function(done) {
        user1.email = 'abc\"def@abc.com';
        user1.save().then(function(err) {
          if (err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should not allow double dotted characters in email address - "abcdef@abc..com"', function(done) {
        user1.email = 'abcdef@abc..com';
        user1.save().then(function(err) {
          if (err) {
            user1.destroy().then(function(err_remove) {
              should.exist((err) ? null : err);
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.exist((err) ? null : err);
            done();
          }
        }).catch(function(err) {});

      });

      it('should allow single quote characters in email address - "abc\'def@abc.com"', function(done) {
        user1.email = "abc\'def@abc.com";
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            done();
          }
        }).catch(function(err) {});

      });

      it('should allow valid email address - "abc@abc.com"', function(done) {
        user1.email = 'abc@abc.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            done();
          }
        }).catch(function(err) {});

      });

      it('should allow valid email address - "abc+def@abc.com"', function(done) {
        user1.email = 'abc+def@abc.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            done();
          }
        }).catch(function(err) {});

      });

      it('should allow valid email address - "abc.def@abc.com"', function(done) {
        user1.email = 'abc.def@abc.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            done();
          }
        }).catch(function(err) {});

      });

      it('should allow valid email address - "abc.def@abc.def.com"', function(done) {
        user1.email = 'abc.def@abc.def.com';
        user1.save().then(function(err) {
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
            done();
          }
        }).catch(function(err) {});

      });

      it('should allow valid email address - "abc-def@abc.com"', function(done) {
        user1.email = 'abc-def@abc.com';
        user1.save().then(function(err) {
          should.not.exist((err) ? null : errorHandler.getErrorMessage(err));
          if (!err) {
            user1.destroy().then(function(err_remove) {
              should.not.exist(err_remove);
              done();
            }).catch(function(err) {});
          } else {
            done();
          }
        }).catch(function(err) {});

      });

    });
  */
  after(function(done) {
    user1.destroy().then(function() {
      user2.destroy().then(function() {
        done();
      }).catch(function(err) {});
    }).catch(function(err) {});
    // user3.destroy().then(function() {
    //   done();
    // }).catch(function(err) {});
  });
});