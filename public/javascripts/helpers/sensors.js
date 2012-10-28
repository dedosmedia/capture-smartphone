define([], function(){
  return {
    'deviceorientation':function(callback){
      window.addEventListener('deviceorientation', function(e){
        callback('deviceorientation',{
          alpha:e.alpha,
          beta:e.beta,
          gamma:e.gamma
        });
      });
    },
    'devicemotion':function(callback){
      window.addEventListener('devicemotion', function(e){
        callback('devicemotion',{
          acceleration:e.acceleration,
          accelerationIncludingGravity:e.accelerationIncludingGravity,
          rotationRate:e.rotationRate
        });
      });
    },
    'geolocation':function(callback){
      navigator.geolocation.watchPosition(function(location){
        callback('geolocation', location.coords);
      });
    }
  };
});
