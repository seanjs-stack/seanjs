'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
        fs = require('fs'),
        path = require('path'),
        errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
        db = require(path.resolve('./config/lib/sequelize')).models,
        User = db.user;


/**
 * Update user details
 */
exports.update = function (req, res) {
   // Init Variables
   var user = req.user;

   // For security measurement we remove the roles from the req.body object
   delete req.body.roles;

   if (user) {
      // Merge existing user
      user = _.extend(user, req.body);
      user.updatedAt = Date.now();
      user.displayName = user.firstName + ' ' + user.lastName;

      user.save().then(function (user) {
         if (!user) {
            return res.status(400).send({
               message: errorHandler.getErrorMessage(err)
            });
         } else {
            req.login(user, function (err) {
               if (err) {
                  res.status(400).send(err);
               } else {
                  res.json(user);
               }
            });
         }
      }).catch(function (err) {
         res.status(400).send({
            message: 'User is not signed in'
         });
      });

   }
};

/**
 * Update profile picture
 */
exports.changeProfilePicture = function (req, res) {
   var user = req.user;
   var message = null;
   var oldImage = user.profileImageURL;

   if (user) {
      fs.writeFile(__dirname + './public/uploads/users/profile/' + req.files.file.name, req.files.file.buffer, function (uploadError) {
         if (uploadError) {
            console.log('uploadError', uploadError);
            return res.status(400).send({
               message: 'Error occurred while uploading profile picture'
            });
         } else {

            user.profileImageURL = req.files.file.name;

            user.save().then(function (saved) {
               if (!saved) {
                  return res.status(400).send({
                     message: errorHandler.getErrorMessage(saved)
                  });
               } else {

                  if (oldImage) {
                     fs.unlinkSync('./public/uploads/users/profile/' + oldImage);
                  }

                  req.login(user, function (err) {
                     if (err) {
                        res.status(400).send(err);
                     } else {
                        res.json(user);
                     }
                  });
               }
            });
         }
      });
   } else {
      res.status(400).send({
         message: 'User is not signed in'
      });
   }
};

exports.getProfile = function (req, res) {
   User.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email', 'username'],
      where: {
         id: req.user.id
      }
   }).then(function (user) {
      res.json(user);
   }).catch(function (err) {
      res.status(400).send(err);
   });
};


/**
 * Send User
 */
exports.me = function (req, res) {
   res.json(req.user || null);
};