define(['helpers/clean_touch_event'], 
function(cleanTouchEvent){
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
        callback('touchstart',cleanTouchEvent(e));
        e.preventDefault();
      });
    },
    'touchend': function(callback){
      window.addEventListener('touchend', function(e){
        callback('touchend',cleanTouchEvent(e));
      });
    },
    'touchmove': function(callback){
      window.addEventListener('touchmove', function(e){
        callback('touchmove',cleanTouchEvent(e));
      });
    }
  };
});
