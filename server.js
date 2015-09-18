var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('public'));
app.get('/', function(req, res, next) {
  res.sendFile(__dirname + "/public/index.html");
});


server.listen(4200);
