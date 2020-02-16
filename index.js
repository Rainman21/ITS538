var express = require('express');
var app = express();
var fs = require("fs");

app.get('/listUsers', function (req, res) {
  fs.readFile(__dirname + "/data/" + "users.json", 'utf8', function (err, data) {
    console.log(data);
    res.end(data);
  });
})

app.get('/User', function (req, res) {
  console.log("REST Call:User")
  user = {}
  user.Name = 'Rick';
  user.ID = 23949230985;
  res.end(JSON.stringify(user));
  
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})