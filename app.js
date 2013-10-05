var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();
var port = 3000;
var server, io;

app.configure(function(){
  app.set('port', process.env.PORT || port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  // app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/remote', routes.remote);
app.get('/photos', routes.photos);
app.get('/photo', routes.photo);
app.get('/rand', routes.rand);
app.post('/repo', routes.repo);

server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io = require('socket.io').listen(server);
io.set('log level', 1);
io.sockets.on('connection', function (socket) {
  socket.on('type', function (data) {
    socket.broadcast.emit('type', data);
  });
  socket.on('action', function (data) {
    socket.broadcast.emit('action', data);
  });
  socket.on('status', function (data) {
    socket.broadcast.emit('status', data);
  });
});