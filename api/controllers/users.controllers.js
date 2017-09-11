var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');

module.exports.register = function(req, res) {
  console.log('registering user');

  var username = req.body.username;
  var name = req.body.name || null;
  var password = req.body.password;

  User.create({
    username: username,
    name: name,
    password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  }, function(err, user) {
    if (err) {
      console.log('Error registering user');
      res
        .status(400)
        .json(err);
    } else {
      console.log("User created", user);
      res
        .status(201)
        .json(user);
    }
  });
};

module.exports.login = function(req, res) {
  console.log('logging in user');

  var username = req.body.username;
  var password = req.body.password;

  User
    .findOne({
      username: username
    })
    .exec(function(err, user) {
      if (err) {
        console.log('Error getting user');
        res
          .status(400)
          .json(err);
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          console.log('User found', user);
          var token = jwt.sign(
            { username: user.username },
            'Mu$tb3pr0fe$$iona1',
            { expiresIn: 3600 });
          res
            .status(200)
            .json({
              success: true,
              token: token
            });
        } else {
          res
            .status(401)
            .json('Unauthorized');
        }
      }
    });
};

module.exports.authenticate = function(req, res, next) {
  var headerExists = req.headers.authorization;
  if (headerExists) {
    var token = req.headers.authorization.split(' ')[1];
    jwt.verify(
      token,
      'Mu$tb3pr0fe$$iona1',
      function(error, decoded) {
        if (error) {
          console.log(error);
          res
            .status(401)
            .json('Unauthorized');
        } else {
          req.user = decoded.username;
          next();
        }
      });
  } else {
    res
      .status(403)
      .json('No token provided.');
  }
};
