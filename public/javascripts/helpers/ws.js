define(['/socket.io/socket.io.js'],
function(){
  var ws = io.connect('http://'+document.location.hostname);
  console.log(ws);
  return ws;
});