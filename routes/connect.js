var express = require('express');
var models = require('../models');
var config = require('../config');

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
  
  var User = models.User;
  User
  .find({ where: { username: username } })
  .success(function(user) {
    var Connection = models.Connection;
    Connection
    .create({ 
      url: connectionUrl,
      username: connectionUsername
    })
    .complete(function(error, connection){
      user.addConnection(connection).success(function(){
        var configData = config();
        var data = {
          url: configData.url + ':' + configData.port,
          username: username,
          timestamp: connection.createdAt.toUTCString()
        };
        
        // connect to the newly created server
        var socket = require('socket.io-client')(connection.url);
        socket.on('connect', function(){
          // emit a server-new-connection event from this server
          socket.emit('server new connection', data);
          socket.on('disconnect', function(){
            console.log('we disconnected from ' + conn.url);
          });
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
    .success(function(user) {
      next(user);
    });
};

module.exports = router;