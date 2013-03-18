var os = require('os');

function getPort(host){
  return ( host.match(/:/g) ) ? host.slice( 1+host.indexOf(":"), host.length ) : 80;
}

exports.sensor = function(req, res){
  res.render('sensor', { title: 'sensing...'});
};

exports.index = function(req, res){
  res.render('index', { 
    title: 'Le menu', 
    address: req.protocol + '://' + os.hostname() + ':' + getPort(req.headers.host)
  });
};

exports.display = function(req, res){
  res.render('display', { title: 'This is a display.'});
};