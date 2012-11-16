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

define(['text!/partials/player.hbs.html','ws','handlebars'], function(hbs_player, ws){
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

  ws.on('events', function(devices){
    for(var id in devices){
      var device=devices[id];
      device.id=id;
      var createIfNotExist = function(device){
        var el = document.querySelector('[data-socketid=device_'+device.id+']');
        if(!el){
          var el=document.createElement('div');
          el.innerHTML=t_player(device);
          document.querySelector('.container').appendChild(el.querySelector('section'));
        }
      }(device);
      
      for(var eventType in device){
        var data=device[eventType];
        if(eventType=='deviceorientation') {
          updateMeter('deviceorientation_alpha', id, data.e.alpha);
          updateMeter('deviceorientation_beta', id, data.e.beta);
          updateMeter('deviceorientation_gamma', id, data.e.gamma);
        }
        if(eventType=='devicemotion'){
          updateMeter('accelerationIncludingGravity_x', id, data.e.accelerationIncludingGravity.x);
          updateMeter('accelerationIncludingGravity_y', id, data.e.accelerationIncludingGravity.y);
          updateMeter('accelerationIncludingGravity_z', id, data.e.accelerationIncludingGravity.z);
          updateMeter('acceleration_x', id, data.e.acceleration.x);
          updateMeter('acceleration_y', id, data.e.acceleration.y);
          updateMeter('acceleration_z', id, data.e.acceleration.z);
        }
        if(eventType=='geolocation'){
          for(var key in data.e){
            updateMeter('geolocation_'+key, id, data.e[key]);
          }
        }
        if(eventType=='touchstart'){
          onTap(id);
        }
        if(eventType=='touchmove'){
          console.log('touchmove');
        }
        if(eventType=='touchend'){
          onTapEnd(id);
        }
      }
      

    }
  });

  ws.on('client disconnected', function(data){
    var el = document.querySelector('[data-socketid="device_'+data.id+'"]');
    if(el)document.querySelector('.container').removeChild(el);
  });  
});

