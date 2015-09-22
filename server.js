var expressio = require('express.io'),
    app = expressio(),
    dbName = "bookmarks",
    bunyan = require("bunyan"),
    log = bunyan.createLogger({name: "lese"}),
    nano = require('nano')('http://localhost:5984'),
    db = nano.use(dbName),
    logDb = nano.use("log")

// initialize database
function createDatabase(conn, dbName, logger) {
  conn.db.create(dbName, function(err, body) {
    if(!err) {
      logger.info("Database '" + dbName + "' successfully created!")
    } else {
      logger.error("Database creation failed: " + err)
    }
  })
}

// running shell commands
function tellFortune(callback){
  var sys = require('sys');
  var exec = require('child_process').exec;
  exec("fortune -s -n 40",
       function(error, stdout, stderr){
         callback(stdout);
       });
};

// Static routes
app.http().io();
app.use(expressio.static('public'));
app.use('/static', expressio.static('bower_components'));
app.get('/', function(req, res, next) {
  res.sendfile(__dirname + "/public/index.html");
});

// Websocket routes
app.io.route('ready', function(req) {
  logDb.insert(log.info("test"))
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

