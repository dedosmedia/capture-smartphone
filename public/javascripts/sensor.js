requirejs.config({
  baseUrl:'/javascripts',
  paths:{
    text:'lib/requirejs-text.2.0.3',
    handlebars:'lib/handlebars-1.0.rc.1',
    socketio:'/socket.io/socket.io',
    ws:'helpers/ws',
    event2socket:'helpers/event2socket'
  },
  shim:{
    'handlebars':['text'],
    'ws':['socketio']
  }
});

define(['ws','handlebars','event2socket'],
function(ws){
  ws.on('hello', function(data){ // we should fire this when opening a "game"
    document.body.style.backgroundColor=data.color;
    document.querySelector('h3').innerHTML='';
    ws.emit('events', {deviceinfo:{width:window.innerWidth,height:window.innerHeight}});
  });
  ws.on('disconnect', function(){
    document.querySelector('h3').innerHTML='disconnected';
  });
  ws.on('display connected', function(){
    // report as a client with fresh info to the display
    ws.emit('events', {deviceinfo:{width:window.innerWidth,height:window.innerHeight}});
  });
  ws.emit('join','sensors');
});
