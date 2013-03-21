define(['ws','helpers/sensors'],
function(ws, sensors){
  var interval = 50, eventQueue = {};

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

  // Todo activate subscription per event type 
  //sensors.deviceorientation(emitAtInterval);
  //sensors.devicemotion(emitAtInterval);
  //sensors.geolocation(emitAtInterval);
  sensors.touchstart(emitAtInterval);
  sensors.touchmove(emitAtInterval);
  sensors.touchend(emitAtInterval);

});