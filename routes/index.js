exports.index = function(req, res){
  res.render('index', { title: 'Setup this device' });
};

exports.sensor = function(req, res){
  res.render('sensor', { title: 'sensing...'});
};

exports.display = function(req, res){
  res.render('display', { title: 'This is a display.'});
};