'use strict';

var nodemailer = require("nodemailer");
var config = require('../../config');

function Email() {
  this.smtpTransport = nodemailer.createTransport("SMTP", {
    service: config.email.service,
    secureConnection: false,
    auth: {
      XOAuth2: {
        user: config.email.user,
        clientId: config.email.clientId,
        clientSecret: config.email.clientSecret,
        refreshToken: config.email.refreshToken,
        accessToken: config.email.accessToken,
        timeout: config.email.timeout
      }
    }
  });
}

Email.prototype = {

  send: function (to, subject, body, attachments) {
    var mailOptions = {
      from: config.email.user,
      to: to,
      subject: subject,
      generateTextFromHTML: true,
      html: body,
      attachments: attachments
    }

    var _smtpTransport = this.smtpTransport;
    return new Promise(function (resolve, reject) {
      _smtpTransport.sendMail(mailOptions, function (error, response) {
        var statusCode = 200;

        _smtpTransport.close();
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

var email = new Email();

module.exports = email;