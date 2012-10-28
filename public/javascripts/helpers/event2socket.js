define(['ws','helpers/sensors'],
function(ws, sensors){
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

  sensors.deviceorientation(emitAt100msInterval);
  sensors.devicemotion(emitAt100msInterval);
  sensors.geolocation(emitAt100msInterval);

});