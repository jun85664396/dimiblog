var io = require('socket.io');
var cookie = require('cookie');
var sessionContainer = require('../sessionContainer');
var parse = require('../lib/parse');

var clientSockets = new Array();

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
    var hs = socket.handshake;
    /* NOTE: At this point, you win. You can use hs.sessionID and
     *       hs.session. */
    if(!hs.sessionID){
      // server
      console.log('if we reach this point we are listening to a "server new connection" event...');
      socket.on('server new connection', function(data){
        console.log(data)
        setTimeout(function(){
          socket.disconnect();
        }, 3000);
        
        if(clientSocket.length == 1){
          var client = clientSocket[0];
          client.emit('news', { hello: 'we have a new connection!' });
          console.log("event sent to the client.");
        }
      });
    } else {
      // logged in user
      console.log('A socket with sessionID '+hs.sessionID+' connected.');
      socket.emit('news', { hello: 'world' });
      socket.on('my other event', function (data) {
        console.log(data);
      });
      clientSocket.push(socket);
    }
  });
};

module.exports = sockets;