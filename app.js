
/**
 * Module dependencies.
 */

var express = require('express')
  , atob = require('atob')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

app.get('/', routes.index);
app.get('/sensor', routes.sensor);
app.get('/display', routes.display);

// start server
var ioHandle = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// le socket web
io = io.listen(ioHandle);

io.sockets.on('connection', function (socket) {
  function calcColor(base64id){
    var id = atob(base64id);
    return 'hsl('+
      id.charCodeAt(0)+
      ','+
      parseInt(id.charCodeAt(1)/5.12)+
      '%,'+
      parseInt(25+id.charCodeAt(2)/5.12)+
      '%)';
  }
  
  // calc a color, save it to this connection
  var color = calcColor(socket.id);
  socket.color = color;
  socket.events = {};
  socket.emit('hello', {id:socket.id, color:color});

  // let displays know about connects and disconnects
  io.sockets.in('displays').emit('client connected', {id:socket.id, color:color});
  socket.on('disconnect', function(){
    io.sockets.in('displays').emit('client disconnected', {id:socket.id, color:color});
  });

  socket.on('events', function (data) {
    for(var eventName in data){
      socket.events[eventName]=data[eventName];
    }
  });

  socket.on('join', function(room){
    socket.join(room);
  });
  
  var broadcastInterval = setInterval(function(){
    var clients={}, empty=true;
    // loop through all clients and their events, and pick them up
    io.sockets.clients('sensors').forEach(function(socket){
      var events = socket.events, id = socket.id;
      clients[id]={color:socket.color}; // we should let the client calc this
      for(var key in events){
        clients[id][key]=events[key];
        delete events[key];
        empty=false;
      }
    });
    if(!empty) io.sockets.in('displays').emit('events', clients);
  }, 100);
});
