var http = require('http');
var path = require('path');
var express = require('express');

var app = express();
var server = http.createServer(app);

var routes = require('./app/routes');

app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'pug');

app.use('/', routes);
app.use(express.static(path.resolve(__dirname, 'public')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});