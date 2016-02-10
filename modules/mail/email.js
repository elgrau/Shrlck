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

  send: function(to, subject, body, attachments) {


    var mailOptions = {
      from: config.email.user,
      to: to,
      subject: subject,
      generateTextFromHTML: true,
      html: body,
      attachments: attachments
    }

    var _smtpTransport = this.smtpTransport;
    return new Promise(function(resolve, reject) {
      _smtpTransport.sendMail(mailOptions, function(error, response) {
        var statusCode = 200;

        _smtpTransport.close();
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  },

  createHtml: function(body) {
    return '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title></title></head><body>' + body + '</body></html>';
  }
}

var email = new Email();

module.exports = email;