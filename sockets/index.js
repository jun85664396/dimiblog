var io = require('socket.io');
var cookie = require('cookie');
var sessionContainer = require('../sessionContainer');
var parse = require('../lib/parse');

var sockets = function(server){

  var sio = io.listen(server);
  
  sio.set('authorization', function(data, accept){
    /* NOTE: To detect which session this socket is associated with,
     *       we need to parse the cookies. */
    if (!data.headers.cookie) {
      return accept(null, true);
    }
    
    data.cookie = cookie.parse(data.headers.cookie);
    data.cookie = parse.signedCookies(data.cookie, sessionContainer.secret);
    data.sessionID = data.cookie[sessionContainer.key];
    sessionContainer.store.get(data.sessionID, function(err, session){
      if (err) {
        return accept('Error in session store.', false);
      } else if (!session) {
        return accept('Session not found.', false);
      }
      if(!session.username){
        return accept('Session not authenticated', true);
      }
      data.session = session;
      return accept(null, true);
    });
  });
  
  sio.sockets.on('connection', function (socket) {
    // smg here
    if(!socket.handshake){
      // server
      console.log('if we reach this point we are listening to a server "server new connection" event...');
      socket.on('server new connection', function(data){
        console.log(data)
        // socket.disconnect();
      });
    } else {
      // logged in user
      var hs = socket.handshake;
      console.log('A socket with sessionID '+hs.sessionID+' connected.');
      /* NOTE: At this point, you win. You can use hs.sessionID and
       *       hs.session. */
      socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });
    }
  });
};

module.exports = sockets;