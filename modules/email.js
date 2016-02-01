'use strict';

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP", {
  service: "Gmail",
  auth: {
    XOAuth2: {
      user: "miguelangelgraumartinez@gmail.com", // Your gmail address.
      // Not @developer.gserviceaccount.com
      clientId: "214814955377-v5o9qab9v7cumnqlf8amjvo47bs45qq4.apps.googleusercontent.com",
      clientSecret: "JZBLWeiAbAjtNXEfvJz6nGug",
      refreshToken: "1/HVjEgIx1zT6-qPAW_p_3E3O5Bjqgl5t1KijGAv3XpGNIgOrJDtdun6zK6XiATCKT",
      accessToken: "ya29.dAIMAxpcONMCIsPE-bMXjE2fI1PNxe8TWWS3zDtKizTqgz-ZKYVmYla-7hqyx6MobbKk",
      timeout: 3600
    }
  }
});

app.get('/hello', function(req, res) {
  var mailOptions = {
    from: "miguelangelgraumartinez@gmail.com",
    to: "yagarsi@gmail.com",
    subject: "Hello",
    generateTextFromHTML: true,
    html: "<b>Hello world</b>"
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response);
    }
    smtpTransport.close();
    res.send(200);
  });
});