// oauth module  
// var OAuth = require('oauth').OAuth;
// var oa = new OAuth(
//   "http://api.discogs.com/oauth/request_token",
//   "http://api.discogs.com/oauth/access_token",
//   "BCvgSeawxoZCPYqThnPV",
//   "FxEPTHDkhtqGoZGHhrQDojwgyPIEhLGm",
//   "1.0",
//   "http://localhost:3000/auth/callback",
//   "HMAC-SHA1"
// );

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

exports.feed = function (req, res) {
  res.render('feed');
};