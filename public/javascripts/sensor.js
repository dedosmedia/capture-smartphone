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

define(['text!/partials/player.hbs.html','ws','handlebars','event2socket'],
function(hbs_player,ws){
  var t_player = Handlebars.compile(hbs_player);

  ws.on('hello', function(data){
    document.body.style.backgroundColor=data.color;
    console.log(data);
  });
});
