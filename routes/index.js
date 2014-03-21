// index
exports.index = function(req, res){
  res.render('index'); 
};

exports.search = function(req, res) {
  res.render('search');
}

exports.collection = function (req, res) {
  res.render('collection');
};

exports.wants = function (req, res) {
  res.render('wants');
};
