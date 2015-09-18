var expressio = require('express.io');
var app = expressio();
app.http().io();

app.use(expressio.static('public'));
app.use('/static', expressio.static('bower_components'));

app.get('/', function(req, res, next) {
  res.sendfile(__dirname + "/public/index.html");
});

app.io.route('ready', function(req) {
  req.io.emit('talk', {
    message: 'io event from an io route on the server'
  });
});

var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Server started at: http://%s:%s', host, port);
});
