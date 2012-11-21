define([], function(){
  return function clean_touchEvent(obj){
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
});