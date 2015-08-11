var express = require('express');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var cors = require('cors');
var bodyParser = require('body-parser');
var userController = require('./controllers/userController.js');
var authController = require('./controllers/authController.js');
var formController = require('./controllers/formController.js');
var passport = require('passport');
var secrets = require('./config/secrets.js');

var DBURI = secrets.DBURI;
var mongooseURI = uriUtil.formatMongoose(DBURI);

mongoose.connect(mongooseURI);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/img", express.static(__dirname + '/img'));

app.use(passport.initialize());

app.post('/postUsers', userController.postUsers);
app.post('/newForm', authController.isAuthenticated, formController.newForm);
app.post('/saveForm', authController.isAuthenticated, formController.saveForm);
app.post('/getAllUserForms', authController.isAuthenticated, formController.getAllUserForms);

app.get('/test', function(req, res) {
	res.send({isOn : true});
});

app.listen(process.env.PORT || 5000);
console.log('Running on :5000');