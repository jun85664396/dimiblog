var express = require('express');
var models = require('../models');

var router = express.Router();

router.get('/', function(req, res) {
  if(!req.session.username)
    res.redirect('../login');
  
  getUser(req.session.username, function(user){
    user
    .getConnections()
    .complete(function(error, connections){
      res.render('connect', {
        title: 'Add a new connection',
        connections: connections
      });
    });
  });
});

router.post('/', function(req, res) {
  if(!req.session.username)
    res.redirect('../login');
  
  res.setHeader('Content-Type', 'application/json');
  
  var username = req.session.username;
  var connectionUsername = req.body.username;
  var connectionUrl = req.body.url;
  
  getUser(username, function(user){
    var Connection = models.Connection;
    Connection
    .create({ 
      url: connectionUrl,
      username: connectionUsername
    })
    .complete(function(error, connection){
      user.addConnection(connection).success(function(){
        // connect to the server
        var socket = require('socket.io-client')(connection.url);
        // emit a new connection event from this server
        socket.on('connect', function(){
          socket.emit('server-new-connection', poke);
        });
        
        res.end(JSON.stringify({ Message: 'Connection added...' }));
      });
    });
    // done with the complete function
  });
  // done after gettint the user
});

var getUser = function(username, next){
  var User = models.User;
  User
    .find({ where: { username: username } })
    .complete(function(err, user) {
      if(!err)
        next(user);
    });
};

module.exports = router;