define([], function(){
  function clean_touchEvent(obj){
    var whitelist='targetTouches,scale,changedTouches,rotation,touches,'+
    'timeStamp,type,length,'+
    'clientX,clientY,identifier,pageY,pageX,screenX,screenY'+
    '0,1,2,3,4,5,6,7,8,9'+
    ''.split(',');
    var o={};
    for(var key in obj){
      var item = obj[key];
      if(whitelist.indexOf(key) !== -1) {
        if(typeof item !== 'object') {
          o[key]=item;
        } else {
          o[key]=clean_touchEvent(obj[key]);
        }
      }
    }
    return o;
  }

  return {
    'deviceorientation': function(callback){
      window.addEventListener('deviceorientation', function(e){
        callback('deviceorientation',{
          alpha:e.alpha,
          beta:e.beta,
          gamma:e.gamma
        });
      });
    },
    'devicemotion': function(callback){
      window.addEventListener('devicemotion', function(e){
        callback('devicemotion',{
          acceleration:e.acceleration,
          accelerationIncludingGravity:e.accelerationIncludingGravity,
          rotationRate:e.rotationRate
        });
      });
    },
    'geolocation': function(callback){
      navigator.geolocation.watchPosition(function(location){
        callback('geolocation', location.coords);
      });
    },
    'touchstart': function(callback){
      window.addEventListener('touchstart', function(e){
        callback('touchstart',clean_touchEvent(e));
      });
    },
    'touchend': function(callback){
      window.addEventListener('touchend', function(e){
        callback('touchend',clean_touchEvent(e));
      });
    },
    'touchmove': function(callback){
      window.addEventListener('touchmove', function(e){
        callback('touchmove',clean_touchEvent(e));
      });
    }
  };
});
