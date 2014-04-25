var express = require('express');
var models = require('../models');
var crypto = require('crypto')
  , shasum = crypto.createHash('sha1');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var User = models.User;
  User
  .findAll()
  .success(function(users){
    res.render('index', {
      title: 'Express',
      users: users
    });
  });
});

module.exports = router;