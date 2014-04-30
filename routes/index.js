var express = require('express');
var models = require('../models');
var config = require('../config');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var User = models.User;
  var username = req.session.username ? req.session.username: "";
  var configData = config();
  User
  .findAll()
  .success(function(users){
    res.render('index', {
      title: 'Express welcome ' + username,
      users: users,
      url: configData.url,
      port: configData.port
    });
  });
});

module.exports = router;