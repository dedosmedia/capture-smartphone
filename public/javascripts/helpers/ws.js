define(['socketio'],
function(){
  var ws = io.connect('http://homsar.local');
  return ws;
});