function updateMeter(name, val){
  document.querySelector('[name="'+name+'"]').value = val;
}

ws.on('players', function(players){
  document.querySelector('h1').innerHTML = players[0];
});

ws.on('event', function(data){
  if( data.type=='deviceorientation') {
    for(var key in data.e){
      updateMeter('deviceorientation_'+key, data.e[key]);
    }
  }
  if ( data.type=='devicemotion'){
    updateMeter('accelerationIncludingGravity_x', data.e.accelerationIncludingGravity.x);
    updateMeter('accelerationIncludingGravity_y', data.e.accelerationIncludingGravity.y);
    updateMeter('accelerationIncludingGravity_z', data.e.accelerationIncludingGravity.z);
    updateMeter('acceleration_x', data.e.acceleration.x);
    updateMeter('acceleration_y', data.e.acceleration.y);
    updateMeter('acceleration_z', data.e.acceleration.z);
  }
  if(data.type=='geolocation'){
    for(var key in data.e){
      updateMeter('geolocation_'+key, data.e[key]);
    }
  }
});