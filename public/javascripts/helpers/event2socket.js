define(['ws'],
function(ws){
  console.log(ws);
  var lastEmits={};
  function emitAt100msInterval(name, e){
    if(!lastEmits[name]) lastEmits[name] = 0;
    var now=new Date().getTime();
    if(now >= lastEmits[name] + 200 ){
      ws.emit('event', {"type":name, e:e});
      lastEmits[name]=now;
    }// otherwise drop event to avoid spam
  }

  window.addEventListener('deviceorientation', function(e){
    emitAt100msInterval('deviceorientation',{
      alpha:e.alpha,
      beta:e.beta,
      gamma:e.gamma
    });
  });
    
  window.addEventListener('devicemotion', function(e){
    emitAt100msInterval('devicemotion',{
      acceleration:e.acceleration,
      accelerationIncludingGravity:e.accelerationIncludingGravity,
      rotationRate:e.rotationRate
    });
  });
    
  navigator.geolocation.watchPosition(function(location){
    emitAt100msInterval('geolocation', location.coords);
  });

});