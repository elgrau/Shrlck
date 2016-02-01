'use strict';

var Parse = require('node-parse-api').Parse;

var APP_ID = "QOryY35VgLrpatXq6TJ7E4RvB2wryjSWmvR8VvBF";
var MASTER_KEY = "j9t6fCk92XSPQA1gX4S4mvV6AdvThFnaruRBpF4r";

var parse = new Parse(APP_ID, MASTER_KEY);

app.get('/pista/:id', function(req, res) {
  var id = req.params.id;
  var _response = res;

  if (id) {
    parse.find('pista', {
      where: {
        location: id
      }
    }, function(err, response) {
      console.log(response);

      res.send(response);
    });
  }
});