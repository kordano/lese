var expressio = require('express.io');
var app = expressio();
app.http().io();

function tellFortune(callback){
  var sys = require('sys');
  var exec = require('child_process').exec;
  exec("fortune -s -n 40",
       function(error, stdout, stderr){
         callback(stdout);
       });
};

// Static routes
app.use(expressio.static('public'));
app.use('/static', expressio.static('bower_components'));
app.get('/', function(req, res, next) {
  res.sendfile(__dirname + "/public/index.html");
});

// Websocket routes
app.io.route('ready', function(req) {
  tellFortune(function(fortune) {
    req.io.emit('fortune', {
      message: fortune
    });
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server started at: http://%s:%s', host, port);
});

