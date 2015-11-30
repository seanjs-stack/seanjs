'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  reCaptcha = require(path.resolve('./config/lib/reCaptcha')),
  async = require('async'),
  nodemailer = require('nodemailer');

var smtpTransport = nodemailer.createTransport(config.mailer.options);


/**
 * Render the main application page
 */
exports.renderIndex = function(req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function(req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function(req, res) {

  res.status(404).format({
    'text/html': function() {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function() {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function() {
      res.send('Path not found');
    }
  });
};

exports.contact = function(req, res, next) {

  //Let's do stuff in steps...
  async.waterfall([
    function(done) {
      //Verify the captcha
      reCaptcha.verify(req.body.grecaptcha, function(response) {
        if (!response) {
          done(null);
        } else {
          done("Invalid captcha!");
        }
      });
    },
    function(done) {
      // Prepare the contact form email template
      res.render(path.resolve('modules/core/server/templates/contact-form-email'), {
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        subject: req.body.subject
      }, function(err, emailHTML) {
        done(err, emailHTML);
      });
    },
    function(emailHTML, done) {
      //Send the email to the admin
      var mailOptions = {
        to: config.mailer.from,
        from: config.mailer.from,
        subject: req.body.name + ' contacted you on contact us form',
        html: emailHTML
      };

      smtpTransport.sendMail(mailOptions, function(err) {
        if (err) {
          done('Failed to send the email, please try again later.');
        } else {
          return res.send({
            message: 'Thank you for contacting us! We will get back to you as soon as possible!'
          });
        }
      });
    }
  ], function(err) {
    if (err) {
      return res.status(400).send({
        message: err
      });
    }
  });


};
