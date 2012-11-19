define(['ws','helpers/sensors'],
function(ws, sensors){
  var interval = 100, eventQueue = {};

  function emitAtInterval(name, e){
    eventQueue[name]=e;
  }

  var broadcastInterval = setInterval(function(){
    var packet = {}, empty = true;
    // loop through all events, and pick them up
    for(var key in eventQueue){
      packet[key]=eventQueue[key];
      delete eventQueue[key];
      empty=false;
    }
    if(!empty){
      ws.emit('events', packet);
    }
  }, interval);

  // for now we just report all events, as the bytesize probably won't exceed one packet anyways
  sensors.deviceorientation(emitAtInterval);
  sensors.devicemotion(emitAtInterval);
  sensors.geolocation(emitAtInterval);
  sensors.touchstart(emitAtInterval);
  sensors.touchmove(emitAtInterval);
  sensors.touchend(emitAtInterval);

});