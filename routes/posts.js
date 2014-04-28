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
      res.render('posts', {
        title: 'Your posts will appear here',
        posts: posts
      });
    });
  });
});

// get user posts
router.get('/:username', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  if(!req.session.username)
    res.end(JSON.stringify({ Message: 'Authentication required...' }));
  var Post = models.Post;
  
});

router.post('/', function(req, res) {
  
});

module.exports = router;