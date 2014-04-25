var express = require('express');
var models = require('../models');
var crypto = require('crypto');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('login', {
    title: 'Login'
  });
});

router.post('/', function(req, res) {
  var userName = req.body.username;
  var userPassword = req.body.userpassword;
  
  var User = models.User;
  User
    .find({ where: { username: userName } })
    .complete(function(err, johnDoe) {
      if (!!err) {
        console.log('An error occurred while searching for John:', err);
      } else if (!johnDoe) {
        console.log('No user with the username "' + userName + '" has been found.');
      } else {
        var hash = crypto.createHash('sha1');
        hash.update(userPassword, 'utf8');
        var pssw = hash.digest('hex');
        if(johnDoe.password === pssw){
          // console.log('Hello ' + johnDoe.username + '!');
          // console.log('All attributes of ' + johnDoe.username + ':', johnDoe.values);
          req.session.username = johnDoe.username;
          console.log('Hello ' + req.session.username + '!');
        }else{
          console.log('Wrong password for the username "' + userName + '" please try again.')
        }
      }
      // return a response
      if(req.session.username){
        res.render('login', {
          title: 'Welcome ' + req.session.username
        });
      }else{
        res.render('login', {
          title: 'Login'
        });
      }
    });
});

module.exports = router;