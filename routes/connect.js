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

  var userName = req.body.username;
  var userUrl = req.body.url;
  
  var User = models.User;
  User
    .find({ where: { username: userName } })
    .complete(function(err, johnDoe) {
      if (!!err) {
        console.log('An error occurred while searching for ' + userName, err);
      } else if (!johnDoe) {
        console.log('No user with the username "' + userName + '" has been found.');
      } else {
		  console.log('You can find '+username+' at '+url);		
      }
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({ Message: 'Authentication required...' }));
    });
});

module.exports = router;
