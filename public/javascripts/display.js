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

define([
  'helpers/socket2event', 
  'text!/partials/player.hbs.html',
  'ws',
  'handlebars'
  ], function(devices, hbs_player, ws){
  var t_player = Handlebars.compile(hbs_player);
  
  function updateMeter(name, device_id, val){
    var el = document.querySelector('[data-socketid=device_'+device_id+'] [name="'+name+'"]');
    if(el) el.value = val;
  }
  function onTap(device_id){
    var el = document.querySelector('[data-socketid=device_'+device_id+']');
    if(el) el.classList.add('hilite');
  }
  function onTapEnd(device_id){
    var el = document.querySelector('[data-socketid=device_'+device_id+']');
    if(el) el.classList.remove('hilite');
  }

  // Listen to all these remote events!
  devices.addEventListener('devicemotion', function(e){
    updateMeter('accelerationIncludingGravity_x', e.id, e.accelerationIncludingGravity.x);
    updateMeter('accelerationIncludingGravity_y', e.id, e.accelerationIncludingGravity.y);
    updateMeter('accelerationIncludingGravity_z', e.id, e.accelerationIncludingGravity.z);
    updateMeter('acceleration_x', e.id, e.acceleration.x);
    updateMeter('acceleration_y', e.id, e.acceleration.y);
    updateMeter('acceleration_z', e.id, e.acceleration.z);
  });

  devices.addEventListener('deviceorientation', function(e){
    updateMeter('deviceorientation_alpha', e.id, e.alpha);
    updateMeter('deviceorientation_beta', e.id, e.beta);
    updateMeter('deviceorientation_gamma', e.id, e.gamma);
  });
  
  devices.addEventListener('geolocation', function(e){
    for(var key in e){
      updateMeter('geolocation_'+key, e.id, e[key]);
    }
  });

  devices.addEventListener('touchstart', function(e){
    onTap(e.id);
  });
  devices.addEventListener('touchmove', function(e){
    console.log('touchmove');
  });
  devices.addEventListener('touchend', function(e){
    onTapEnd(e.id);
  });
  
	ws.on('client connected', function(device){
		console.log('client connected');
    var el=document.createElement('div');
    el.innerHTML=t_player(device);
    document.querySelector('.container').appendChild(el.querySelector('section'));
	});

  ws.on('client disconnected', function(data){
    var el = document.querySelector('[data-socketid="device_'+data.id+'"]');
    if(el)document.querySelector('.container').removeChild(el);
  });
  
  ws.emit('join','displays');
});
