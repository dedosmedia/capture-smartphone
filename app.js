/**
 * Interval - for a weak display or server, use higher value
 */
 var heartbeatInterval = 50;

/**
 * Module dependencies.
 */

var express = require('express')
  , atob = require('atob')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , io = require('socket.io')
  , stats = require('measured').createCollection();

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger("short"));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.staticCache());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

app.get('/', routes.index);
app.get('/sensor', routes.sensor);
app.get('/display', routes.display);
app.get('*', function(req, res){
  var url = 'http://game.tap5.com/sensor/';
  var xmlResponse = '<HTML><BODY><H2>Browser error!</H2>Browser does not support redirects!</BODY> <!-- <?xml version="1.0" encoding="UTF-8"?> <WISPAccessGatewayParam xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://www.wballiance.net/wispr_2_0.xsd"> <Redirect> <MessageType>100</MessageType> <ResponseCode>0</ResponseCode> <VersionHigh>2.0</VersionHigh> <VersionLow>1.0</VersionLow> <AccessProcedure>1.0</AccessProcedure> <AccessLocation>CDATA[[isocc=,cc=,ac=,network=Coova,]]</AccessLocation> <LocationName>CDATA[[My_HotSpot]]</LocationName> <LoginURL>'+url+'</LoginURL> <AbortLoginURL>'+url+'</AbortLoginURL> <EAPMsg>AQEABQE=</EAPMsg> </Redirect> </WISPAccessGatewayParam> --> </HTML>';
  res.statusCode = 302;
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.setHeader('Content-Length', xmlResponse.length);
  res.setHeader('Location', url);
  console.log('Captive portal request detected: '+req.url);
  res.write(xmlResponse);
  res.end();
});

// start server
var ioHandle = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// le socket web
io = io.listen(ioHandle);

io.set('log level', 1);
io.enable('browser client minification');
io.enable('browser client gzip');
io.set('transports', [
    'xhr-polling'
//    'websocket'
//  , 'flashsocket'
//  , 'htmlfile'
//  , 'xhr-polling'
//  , 'jsonp-polling'
]);

io.sockets.on('connection', function (socket) {
  function calcColor(base64id){
    var id = atob(base64id);
    return 'hsla('+
      id.charCodeAt(0)+
      ','+
      parseInt(id.charCodeAt(1)/5.12)+
      '%,'+
      parseInt(25+id.charCodeAt(2)/5.12)+
      '%, 1)';
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

  // allow clients to join rooms
  socket.on('join', function(room){
    socket.join(room);
    if(room=='displays'){
      io.sockets.in('sensors').emit('display connected'); // "fresh start"
    }
  });
  
  // cache all events serverside until we flush the queue next time
  socket.on('events', function (data) {
    stats.meter('incoming events').mark();
    for(var eventName in data){
      socket.events[eventName]=data[eventName];
    }
  });

  var broadcastInterval = setInterval(function(){
    var clients={}, empty=true;
    // loop through all clients and their events, and pick them up
    io.sockets.clients('sensors').forEach(function(socket){
      var events = socket.events, id = socket.id;
      clients[id]={color:socket.color};
      for(var key in events){
        clients[id][key]=events[key];
        delete events[key];
        empty=false;
      }
    });
    if(!empty) io.sockets.in('displays').emit('events', clients);
  }, heartbeatInterval);
});

setInterval(function() {
  console.log(stats.toJSON());
}, 1000);