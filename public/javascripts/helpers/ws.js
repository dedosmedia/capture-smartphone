define(['socketio'],
function(){
  var ws = io.connect('http://'+document.location.hostname);
  return ws;
});