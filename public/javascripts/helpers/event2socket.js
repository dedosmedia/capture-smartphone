define(['ws','helpers/sensors'],
function(ws, sensors){
  var interval = 200;
  console.log(ws);
  var lastEmits={};
  function emitAtInterval(name, e){
    if(!lastEmits[name]) lastEmits[name] = 0;
    var now=new Date().getTime();
    if(now >= lastEmits[name] + interval ){
      ws.emit('event', {"type":name, e:e});
      lastEmits[name]=now;
    }// otherwise drop event to avoid spam
  }

  sensors.deviceorientation(emitAtInterval);
  sensors.devicemotion(emitAtInterval);
  sensors.geolocation(emitAtInterval);

});