var sessionstore = require('sessionstore');

module.exports = {
  store: sessionstore.createSessionStore(),
  key: 'sid',
  secret: 'something big is going to happen'
};