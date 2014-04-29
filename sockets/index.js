var socketio = require('socket.io');

var sockets = function(server){
  var io = socketio.listen(server);
  io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
};

module.exports = sockets;