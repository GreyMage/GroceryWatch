var _package = require('./package.json');
var _config = require('./config.json');

var deferred = require('deferred');
var Datastore = require('nedb');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser'); 
var session = require('express-session');
var schedule = require('node-schedule');

// Mail Setup
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transport = nodemailer.createTransport(smtpTransport(_config.smtpTransport));

// functions
var formatSubject = function(str){
	return _package.name + " :: " + str;
}

var getBaseEmailConfig = function(){
	return {
    from: _package.name + " <noreply@cades.me>",
    to: "bulzeeb@gmail.com",
    subject: formatSubject('Forgot to enter a Subject'),
    text: "Forgot to enter text."
  }
}

var sendRawEmail = function(base){
	transport.sendMail(base, function(error, info){
    if(error){
        console.error(error);
    }
	});
}

var sendOrderReminder = function(product){
	var base = getBaseEmailConfig();
	base.subject = formatSubject("Order Reminder");
	base.text = "Hello! This is a reminder that "+product+" will need to be ordered soon."
	sendRawEmail(base);
}


var INDEV = true;

var catalog = [
	{name:"Protien Powder"},
	{name:"CalMag"},
];

// Sessions handler
app.use(session({
	secret: 'omg its rainbowdash',
	resave:false,
	saveUninitialized:false
}));

// Template Engine
app.set('views', __dirname + '/dist/views');
app.set('view engine', 'jade');

// Setup Post-parser
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use(express.static(__dirname + '/dist/public'));
app.get('/', function (req, res) {
	console.log(catalog);
  res.render('index', { package: _package, INDEV:INDEV, catalog:catalog});
});

app.get('/new', function (req, res) {
	catalog.push({name:"Ponk"});
	res.redirect('/');
});

app.all('/email', function (req, res) {

	sendOrderReminder("Malk");
	req.session.hits = (req.session.hits || 0) + 1;
	console.log("hits from this source",req.session.hits);
	res.redirect('/');

});

// Any procedural stuff
server.listen(3000);


var date = new Date(2015, 5, 5, 16, 10, 0);

if(date > new Date()){
	console.log("scheduled for",date)
	schedule.scheduleJob(date, function(){
		console.log("sending email");
		sendOrderReminder("Internets");
	});
}
