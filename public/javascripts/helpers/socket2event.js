define(['ws'],
function(ws){
  var events = {};
  
  function fire(eventType, data){
    var listeners = events[eventType];
    for(var i in listeners){
      listeners[i](data);
    }
  }
  
  function addEventListener(eventType, callback){
    if(!events[eventType]) events[eventType] = [];
    events[eventType].push(callback);
  }

  function removeEventListener(eventType, callback){
    var eventList = events[eventType], 
    index = eventList.indexOf(callback);
    if(eventList && index -1){
      eventList.splice(index, 1);
    }
  }
  
  ws.on('events', function(devices){
    for(var id in devices){
      var device=devices[id];
      device.id=id;
      
      for(var eventType in device){
        var data=device[eventType];
        fire(eventType, data);
      }
    }
  });

  return {
    addEventListener:addEventListener,
    removeEventListener:removeEventListener
  }

});