


var Form = require('../models/form.js');
var User = require('../models/user.js');
var emailController = require('../controllers/emailController.js');
var json2csv = require('json2csv');
var csv = require('express-csv');

exports.newForm = function(req, res) {

  var form = new Form({
    name: req.body.name,
    emailTo: req.body.emailTo,
    fields : req.body.fields,
    ownerEmail : req.body.ownerEmail,
    secured : req.body.secured,
    pin : req.body.pin,
    settings : req.body.settings,
    isLive : false,
    responses : []
  });
  
  form.save(function(err, form) {
    if (err) {
      // res.send(err);
      console.log(err);
      res.json({ message: 'Something went wrong', success : false });
    } else{
      res.json({ message: 'Form Saved', success : true, form : form });
    }

  });
};

exports.saveForm = function(req, res) {
  Form.update({_id : req.body._id},{
    $set : {
      fields : req.body.fields,
      name : req.body.name,
      pin : req.body.pin,
      secured : req.body.secured,
      emailTo : req.body.emailTo,
      settings : req.body.settings,
      isLive : req.body.isLive
    }
  }).exec(function(err, data) {
    if (err) {
      res.json({message : err, success : false})
    } else {
      res.json({data : data, success : true});
    }
  })
}

exports.getAllUserForms = function(req, res) {

  User.findOne({email : req.body.email}).exec( function(err, user) {
    if (err) {
      res.json({success : false, message : err});
    };
    if (!user) {
      res.json({success : false, message : 'This user does not exist.'});
    };

    user.verifyPassword(req.body.password, function(err, isMatch) {
      if (err) {
        res.json({success : false, message : err});
      };
      if (!isMatch) {
        res.json({success : false, message : 'Password incorrect.'})
      };
      if (isMatch) {
        Form.find({ownerEmail : req.body.email}).exec(function(err, forms) {
          if (err) {
            res.json(err);
          } else {
            res.json({success : true, forms: forms});
          }
        });
      };
    }); // End Verify Password
  });



  
}

exports.postFormResponse = function(req, res) {
  Form.update({_id : req.body.id}, {$push : {responses : req.body.response}}).exec(function(err, data) {
    if (err) {
      res.json({success : false, message : err});
    } else {
      res.json({success : true, message : 'Form submitted successfully', data : data});
      emailController.sendResponseEmail(req.body.response, req.body.id);
    }
  })
}

exports.getFormById = function(req, res) {
  Form.find({_id : req.body.id}, {responses : 0}).limit(1).exec(function(err, forms) {
    if (err) {
      res.json({success : false, message : err});
    } else {
      res.json({success: true, forms : forms});
    }
  });
}

exports.getFormResponseCSV = function(req, res) {
  Form.find({_id : req.body.id}, {responses : 1}).limit(1).exec(function(err, forms) {
    if (err) {
      console.log('Error!');
      res.json({success : false, message : err});
    } else {
      var responses = forms[0].responses;
      var fields = [];
      for (x in responses[responses.length-1]) {
        fields.push(x);
      }
      json2csv({ data: responses, fields: fields }, function(err, csvData) {
        if (err) console.log(err);
        res.csv(responses);
      });

    }
  });
}



exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};

