var express = require('express');
var models = require('../models');
var config = require('../config');

var router = express.Router();

var getPostsFromUser = function(username, next){
  var User = models.User;
  User
  .find({ username: username })
  .success(function(user){
    user
    .getPosts({ order: 'createdAt DESC' })
    .complete(function(err, posts){
      next(posts);
    });
  });
};

// get user posts (public)
router.get('/:username', function(req, res) {
  var User = models.User;
  var username = req.params.username;
  getPostsFromUser(username, function(posts){
    res.render('timeline', {
      title: 'Timeline of ' + username,
      posts: posts
    });
  });
});

// get my posts
router.get('/', function(req, res) {
  if(!req.session.username)
    res.redirect('../login');
  var username = req.session.username;
  
  getPostsFromUser(username, function(posts){
    res.render('posts', {
      title: 'Your posts will appear here',
      posts: posts
    });
  });
});

// post a post LOL
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
    console.log("You found me!");
    var Post = models.Post;
    Post
    .create({ 
      text: req.body.posttext 
    })
    .complete(function(error, post){
      console.log("Post created!");
      user.addPost(post).success(function(){
        // Added!
        console.log("Post added to me!");
        res.end(JSON.stringify({ date: post.createdAt.toUTCString() }));
        // Now we have issued a response so we are free to connect to a server.
        pokeServers(username, post);
      });
    });
  });
};

var pokeServers = function(username, post){
  // send a poke to all the servers in my connections
  getConnectionsFromUser(username, function(connections){
    // build the poke message
    var configObj = config();
    var poke = {
      username: username,
      url: configObj.url + ':' + configObj.port,
      timestamp: post.createdAt.toUTCString()
    };
    console.log("We have fetched " + connections.length + " connections");
    // iterate and do a socket.io client emit event.
    for (var i = 0; i < connections.length; i ++){
      var conn = connections[i];
      var socket = require('socket.io-client')(conn.url);
      socket.on('connect', function(){
        socket.emit('server poke', poke);
        socket.on('disconnect', function(){
          console.log('we disconnected from ' + conn.url);
        });
      });
    }
  });
};

var getConnectionsFromUser = function(username, next){
  var User = models.User;
  User
  .find({ username: username })
  .success(function(user){
    user
    .getConnections({ order: 'createdAt DESC' })
    .complete(function(err, connections){
      next(connections);
    });
  });
};

module.exports = router;