// modules 
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public/recccords/')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// check cache
app.post('/index', routes.index);

// login 
app.get('/login', routes.login);
app.post('/login', routes.parse_login);
app.post('/recccords/login', routes.parse_login);
// sign up 
app.get('/signup', routes.signup);
app.post('/signup', routes.parse_signup);
app.post('/recccords/signup', routes.parse_signup);

// save credentials 
app.get('/save', routes.save);
app.post('/save', routes.parse_save);

// oauth 
app.get('/auth',routes.oauth);
app.get('/auth/callback',routes.oauth_callback); 

// access the api 
app.get('/identity',routes.identity);
app.get('/user',routes.user);
app.get('/collection',routes.collection);
app.get('/wants',routes.wants);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
