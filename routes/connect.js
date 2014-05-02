var express = require('express');
var models = require('../models');
var config = require('../config');

var router = express.Router();

router.get('/', function(req, res) {
  if(!req.session.username)
    res.redirect('../login');
  var User = models.User;
  User
  .find({ where: { username: username } })
  .success(function(user) {
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
        console.log('attempting to connect to ' + connection.url);
        var clientio = require('socket.io-client');
        var client = clientio.connect(connection.url);
        client.on('connect', function(){
          // emit a server-new-connection event from this server
          client.emit('server new connection', data);
          // disconnect
        });
        
        res.end(JSON.stringify({ Message: 'Connection added...' }));
      });
    });
    // done with the complete function
  });
  // done after gettint the user
});

module.exports = router;