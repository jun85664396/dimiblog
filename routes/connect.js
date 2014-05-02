var express = require('express');
var models = require('../models');
var config = require('../config');

var router = express.Router();

router.get('/', function(req, res) {
  !req.session.username? res.redirect('../login'): getConnectionsFromUser(req, res);
});

var getConnectionsFromUser = function(req, res){
  var username = req.session.username;
  var User = models.User;
  User
  .find({ where: { username: username } })
  .success(function(user) {
    user
    .getConnections()
    .complete(function(error, connections){
      renderConnectionsView(res, connections);
    });
  });
};

var renderConnectionsView = function(res, connections){
  res.render('connect', {
    title: 'Add a new connection',
    connections: connections
  });
};

router.post('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  !req.session.username?
    res.end(JSON.stringify({ Message: 'You need to login first.' })):
    getConnectionsFromUser(req, res);
});

var addConnectionToUser = function(req, res){
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
      var configData = config();
      var data = {
        url: configData.url + ':' + configData.port,
        username: username,
        timestamp: connection.createdAt.toUTCString()
      };
      res.end(JSON.stringify({ Message: 'Connection added...' }));
      connectToServer(connection, data);
    });
  });
};

var connectToServer = function(connection, data){
  var clientio = require('socket.io-client');
  var client = clientio.connect(connection.url);
  client.on('connect', function(){
    // emit a server-new-connection event from this server
    client.emit('server new connection', data);
    // disconnect
  });
};

module.exports = router;