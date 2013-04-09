require.config({
	shim:{
		'/socket.io/socket.io.js':{exports:'io'}
	}
});

define('/javascripts/helpers/ws.js',['/socket.io/socket.io.js'],
function(){
  var ws = io.connect('http://'+document.location.hostname);
  console.log(ws);
  return ws;
});