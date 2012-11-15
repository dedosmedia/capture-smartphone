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
  ws.on('hello', function(data){
    document.body.style.backgroundColor=data.color;
  });
});
