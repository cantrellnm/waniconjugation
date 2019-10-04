const http = require('http');
const path = require('path');
const express = require('express');

const app = express();
const server = http.createServer(app);

const env = process.env.NODE_ENV || 'development';

require('./app/db');
const routes = require('./app/routes');

app.set('views', path.join(__dirname, 'app', 'views'));
app.set('view engine', 'pug');

app.enable('trust proxy');
app.use((req, res, next) => {
  if (env === 'production' && req.header('x-forwarded-proto') !== 'https') {
    res.redirect('https://' + req.header('host') + req.url);
  } else {
    next();
  }
});

app.use('/', routes);
app.use(express.static(path.resolve(__dirname, 'public')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  const addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
