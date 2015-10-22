

var nodemailer = require('nodemailer');
var secrets = require('../config/secrets.js');
var Form = require('../models/form.js');


function SendEmail(to, from, subject, body) {

	var transporter = nodemailer.createTransport(secrets.emailOptions);

	var mailOptions = {};

	if (to, from, body, subject) {
		mailOptions.from = from;
		mailOptions.to = to;
		mailOptions.subject = subject;
		mailOptions.html = body;
	};

	transporter.sendMail(mailOptions, function(err, info) {
		if (err) {
		    console.log(err);
		};
		console.log('Message Sent : ' + info.response);
	});
}

exports.sendResponseEmail = function(formResponse, formID) {
	Form.findOne({_id : formID}, {name: 1, emailTo: 1, ownerEmail: 1}).exec(function(err,data) {
		if (err) {
			console.log('Error ' + err);
		};

		var body = '';
		body += '<p>A new response has been posted for your form:</p>';
		body += '<h2>' + data.name + '</h2>';
		for (x in formResponse) {
			body += AddRow(x, formResponse[x]);
		}
		var subject = 'New form response';
		SendEmail(data.emailTo, 'emails@easyforms.co.za', subject, body);
	})
}

function AddRow(key, value) {
	return '<p>' + key + ' : ' + value + '</p>';
}