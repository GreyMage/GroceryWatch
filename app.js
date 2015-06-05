var _package = require('./package.json');

var deferred = require('deferred');
var Datastore = require('nedb');
var express = require('express');
var app = express();
var server = require('http').Server(app);

var INDEV = true;

var catalog = [
	{name:"Protien Powder"},
	{name:"CalMag"},
];

app.set('views', __dirname + '/dist/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/dist/public'));
app.get('/', function (req, res) {
  res.render('index', { package: _package, INDEV:INDEV, catalog:catalog});
}); 

server.listen(3000);