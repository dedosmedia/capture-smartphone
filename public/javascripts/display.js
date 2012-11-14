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

  ws.on('events', function(devices){
    for(var id in devices){
      data=devices[id];
      console.log(data);

      var createIfNotExist = function(device_id){
        var el = document.querySelector('[data-socketid=device_'+device_id+']');
        if(!el){
          var el=document.createElement('div');
          el.innerHTML=t_player({id:device_id});
          document.querySelector('.container').appendChild(el.querySelector('section'));
        }
      }(id);

      if(!devices[data.id]){
        devices[data.id]=true;
        // insert the device into the DOM
      }
      if(data.type=='deviceorientation') {
        updateMeter('deviceorientation_alpha', data.id, data.e.alpha);
        updateMeter('deviceorientation_beta', data.id, data.e.beta);
        updateMeter('deviceorientation_gamma', data.id, data.e.gamma);
      }
      if(data.type=='devicemotion'){
        updateMeter('accelerationIncludingGravity_x', data.id, data.e.accelerationIncludingGravity.x);
        updateMeter('accelerationIncludingGravity_y', data.id, data.e.accelerationIncludingGravity.y);
        updateMeter('accelerationIncludingGravity_z', data.id, data.e.accelerationIncludingGravity.z);
        updateMeter('acceleration_x', data.id, data.e.acceleration.x);
        updateMeter('acceleration_y', data.id, data.e.acceleration.y);
        updateMeter('acceleration_z', data.id, data.e.acceleration.z);
      }
      if(data.type=='geolocation'){
        for(var key in data.e){
          updateMeter('geolocation_'+key, data.id, data.e[key]);
        }
      }
    }
  });

  ws.on('client disconnected', function(data){
    var el = document.querySelector('[data-socketid="device_'+data.id+'"]');
    if(el)document.querySelector('.container').removeChild(el);
  });  
});

