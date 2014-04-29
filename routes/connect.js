var express = require('express');
var models = require('../models');

var router = express.Router();

router.get('/', function(req, res) {
  if(!req.session.username)
    res.redirect('../login');
  res.render('connect', {
    title: 'Connection form'
  });
});

router.post('/', function(req, res) {
  if(!req.session.username)
    res.redirect('../login');
  
  var username = req.session.username;
  var connectionUsername = req.body.username;
  var connectionUrl = req.body.url;
  var User = models.User;

  User
    .find({ where: { username: username } })
    .complete(function(err, thisUser) {
      var Connection = models.Connection;
      Connection
      .create({ 
        url: connectionUrl,
        username: connectionUsername
      })
      .complete(function(error, connection){
        thisUser.addConnection(connection).success(function(){
          res.render('connect', {
            title: 'Connection form',
            message: 'Connection added!'
          });
        });
      });
    });
});

module.exports = router;
