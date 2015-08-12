




var mongoose = require('mongoose');

var FormSchema = new mongoose.Schema({
	name: String,
	emailTo: {
		type: String,
		required: true
	},
	fields : Array,
	ownerEmail : String,
	secured : Boolean,
	pin : String,
	settings : Object,
	isLive : Boolean,
	responses : Array
});


module.exports = mongoose.model('Form', FormSchema);