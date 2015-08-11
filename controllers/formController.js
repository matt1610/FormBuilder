


var Form = require('../models/form.js');

exports.newForm = function(req, res) {

  var form = new Form({
    name: req.body.name,
    emailTo: req.body.emailTo,
    fields : req.body.fields,
    ownerEmail : req.body.ownerEmail,
    secured : req.body.secured,
    pin : req.body.pin,
    settings : req.body.settings,
    isLive : false
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
  Form.find({ownerEmail : req.body.email}).exec(function(err, forms) {
    if (err) {
      res.json(err);
    } else {
      res.json({success : true, forms: forms});
    }
  })
}

exports.getFormById = function(req, res) {
  Form.find({_id : req.body.id}).limit(1).exec(function(err, forms) {
    if (err) {
      res.json({success : false, message : err});
    } else {
      res.json({success: true, forms : forms});
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


// Remove
// User.find({ _id : req.body._id }).remove().exec(function(response) {
//   res.json(response);
// });