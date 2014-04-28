var crypto = require('crypto');

module.exports.addFixtures = function(model){
  var User = model.User;
  var hash = crypto.createHash('sha1');
  hash.update('123123', 'utf8');
  var user = User.build({
    username: 'aledesma',
    password: hash.digest('hex'),
    email: 'aledesma@cs.ucy.ac.cy'
  });
  user
    .save()
    .complete(function(err){
      if (!!err) {
        console.log('The instance has not been saved:', err)
      } else {
        console.log('We have a persisted instance now')
      }
    });
};
