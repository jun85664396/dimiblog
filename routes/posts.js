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
    user.getPosts({ order: 'createdAt DESC' }).complete(function(err, posts){
      res.render('posts', {
        title: 'Your posts will appear here',
        posts: posts
      });
    });
  });
});

// get user posts
router.get('/:username', function(req, res) {
  //
});

router.post('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  !req.session.username ?
    res.end(JSON.stringify({ Message: 'Authentication required...' })):
    addPost(req, res);
});

var addPost = function(req, res){
  var User = models.User;
  var username = req.session.username;
  User
  .find({ username: username })
  .success(function(user){
    var Post = models.Post;
    Post
    .create({ 
      text: req.body.posttext 
    })
    .complete(function(error, post){
      user.addPost(post).success(function(){
        // Added!
        res.end(JSON.stringify({ Message: 'Post added' }));
      });
    });
  });
};

module.exports = router;