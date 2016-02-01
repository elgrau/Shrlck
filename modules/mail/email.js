'use strict';

var nodemailer = require("nodemailer");
var xoauth2 = require('xoauth2');
var config = require('../../config');

function Email() {
  this.smtpTransport = nodemailer.createTransport({
    service: config.email.service,
    secureConnection: false,
    auth: {
      xoauth2: xoauth2.createXOAuth2Generator({
        user: config.email.user,
        clientId: config.email.clientId,
        clientSecret: config.email.clientSecret,
        refreshToken: config.email.refreshToken,
        accessToken: config.email.accessToken
      })
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