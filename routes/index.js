var express = require('express');
var models = require('../models');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var User = models.User;
  var username = req.session.username ? req.session.username: "";
  User
  .findAll()
  .success(function(users){
    res.render('index', {
      title: 'Express welcome ' + username,
      users: users
    });
  });
});

module.exports = router;