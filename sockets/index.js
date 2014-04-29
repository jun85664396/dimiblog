var socketio = require('socket.io');

var sockets = function(server){
  var io = socketio.listen(server);
  io.sockets.on('connection', function (socket) {
    socket.on('poke', function (poke) {
      console.log('Poke: from ' + poke.username + ' in ' + poke.url + ' at ' + poke.timestamp);
    });
  });
};

module.exports = sockets;