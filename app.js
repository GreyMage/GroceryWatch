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

var Datastore = require('nedb');
var userdb = new Datastore({ filename: 'db/users', autoload: true });
userdb.persistence.setAutocompactionInterval(1000 * 60 * 10);


// Mail Setup
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transport = nodemailer.createTransport(smtpTransport(_config.mail.smtpTransport));

// functions
var formatSubject = function(str){
	return _package.name + " :: " + str;
};

var getBaseEmailConfig = function(){
	return {
		from: _package.name + " <noreply@cades.me>",
		to: "bulzeeb@gmail.com",
		subject: formatSubject('Forgot to enter a Subject'),
		text: "Forgot to enter text."
	};
};

var sendRawEmail = function(base){
	transport.sendMail(base, function(error, info){
		if(error){
			console.error(error);  
		}
	});
};

var sendOrderReminder = function(product){
	var base = getBaseEmailConfig();
	base.subject = formatSubject("Order Reminder");
	base.text = "Hello! This is a reminder that "+product+" will need to be ordered soon.";
	sendRawEmail(base);
};

var INDEV = true;

// Because I am 13
app.use(function (req, res, next) {
  res.header("X-powered-by", "ur mom");
  next();
});


// Sessions handler
app.use(session({
	secret: _config.express.secret,
	resave:false,
	saveUninitialized:false
}));


// Try and keep the user object from their session available at all times.
app.use(function (req, res, next) {
	req.session.user = req.session.user || {};
	req.session.user.id = req.session.user.id || "5pyOTPCU9ryfilkY";
	
	userdb.findOne({ _id: req.session.user.id }, function (err, user) {
		req.user = user || {};
		req._user = JSON.stringify(req.user);
		next();
	});
});


// Template Engine
app.set('views', __dirname + '/dist/views');
app.set('view engine', 'jade');

// Setup Post-parser
app.use(bodyParser.json());

// Routes
app.use(express.static(__dirname + '/dist/public'));

// Specific Pages
app.get('/', function (req, res, next) {
	console.log("Hello,",req.user);
	var catalog = req.user.catalog || [];
	catalog[0].now  = new Date();
	res.render('index', { package: _package, INDEV:INDEV, catalog:catalog});
	next();
});

app.post('/saveitem', function (req, res, next) {

	var id = req.body.id;
	var item = req.body.item || false;
	console.log(typeof id != "undefined" , item);
	if(typeof id != "undefined" && item){
		console.log("setting");
		req.user.catalog[id] = item;
	}
	
	res.sendStatus(200);
	next();
	
});

// Finish up the application by checking the user for modifications, and saving back to the DB if needed.
app.use(function (req, res, next) {
	if(JSON.stringify(req.user) == req._user) {
		// We're done here
		console.log("no changes");
		next();
		return;
	}
	console.log("saving modified user");
	userdb.update({ _id: req.user._id }, req.user, {}, function (err, numReplaced) {
		if(err) console.log(err);
		next();
	});
});


// Any procedural stuff
server.listen(3000);

// Experimenting with Scheduler.
// var date = new Date(2015, 5, 5, 16, 10, 0);
//
// if(date > new Date()){
// 	console.log("scheduled for",date)
// 	schedule.scheduleJob(date, function(){
// 		console.log("sending email");
// 		sendOrderReminder("Internets");
// 	});
// }
