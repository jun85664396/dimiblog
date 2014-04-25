var express = require('express');
var models = require('../models');
var crypto = require('crypto')
  , shasum = crypto.createHash('sha1');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('register', {
    title: 'Register'
  });
});

router.post('/', function(req, res) {
  var userName = req.body.username;
  var userEmail = req.body.useremail;
  var userPassword = req.body.userpassword;
  var User = models.User;
  var user = User.build({
    username: userName,
    password: shasum.digest(userPassword),
    email: userEmail
  });
  res.render('registerComplete', {
    title: 'Done!',
    user: user
  });
});

module.exports = router;