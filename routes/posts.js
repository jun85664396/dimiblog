var express = require('express');
var models = require('../models');

var router = express.Router();

// get my posts
router.get('/', function(req, res) {
  if(!req.session.username)
    res.redirect('../login');
  var User = models.User;
  var username = req.session.username;
  User
  .find({ username: username })
  .success(function(user){
    user.getPosts().complete(function(err, posts){
      console.log(posts.length);
    });
  });
  res.render('posts', {
    title: 'Your posts will appear here'
  });
});

// get user posts
router.get('/:username', function(req, res) {

});

router.post('/', function(req, res) {

});

module.exports = router;