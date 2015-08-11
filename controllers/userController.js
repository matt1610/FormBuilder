

var User = require('../models/user.js');

exports.postUsers = function(req, res) {
  console.log(req.body);
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email : req.body.email,
    forms : []
  });
  
  user.save(function(err) {
    if (err) {
      // res.send(err);
      res.json({ message: 'This username already exists', success : false });
    } else{
      res.json({ message: 'Welcome to Applifi FormBuilder', success : true });
    }
      

    
  });
};



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