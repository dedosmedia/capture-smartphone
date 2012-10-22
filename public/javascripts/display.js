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

define(['ws'], function(ws){
  function updateMeter(name, device_id, val){
    document.querySelector('[name="'+name+'"]').value = val;
  }

  ws.on('players', function(players){
    document.querySelector('h1').innerHTML = players[0];
  });

  ws.on('event', function(data){
    if( data.type=='deviceorientation') {
      updateMeter('deviceorientation_alpha', data.id, data.e.alpha);
      updateMeter('deviceorientation_beta', data.id, data.e.beta);
      updateMeter('deviceorientation_gamma', data.id, data.e.gamma);
    }
    if ( data.type=='devicemotion'){
      updateMeter('accelerationIncludingGravity_x', data.id, data.e.accelerationIncludingGravity.x);
      updateMeter('accelerationIncludingGravity_y', data.id, data.e.accelerationIncludingGravity.y);
      updateMeter('accelerationIncludingGravity_z', data.id, data.e.accelerationIncludingGravity.z);
      updateMeter('acceleration_x', data.id, data.e.acceleration.x);
      updateMeter('acceleration_y', data.id, data.e.acceleration.y);
      updateMeter('acceleration_z', data.id, data.e.acceleration.z);
    }
    if(data.type=='geolocation'){
      for(var key in data.e){
        updateMeter('geolocation_'+key, data.e[key]);
      }
    }
  });

  ws.on('client connected', function(data){
    document.querySelector('.player h1').style.backgroundColor = data.color;
    //todo add markup here from template lol
  });  
});

