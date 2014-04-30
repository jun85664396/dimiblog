var socketio = require('socket.io');

var sockets = function(server){
  var io = socketio.listen(server);
  io.sockets.on('connection', function (socket) {
    console.log('We got a new socket connection!');
    // on a poke event coming from a server
    // emit a signal to the client
    socket.on('server poke', function (poke) {
      socket.emit('client-poke', poke);
    });
    // on a new connection event coming from a server
    // emit a signal to the client
    socket.on('server new connection', function (data) {
      console.log('I received a server-new-connection event');
      socket.emit('client new connection', data)
    });
    
  });
};

module.exports = sockets;