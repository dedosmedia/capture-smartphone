
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'What type of device is this?' });
};

exports.sensor = function(req, res){
  res.render('sensor', { title: 'You are a sensor.'});
};

exports.display = function(req, res){
  res.render('display', { title: 'You are a display.'});
};