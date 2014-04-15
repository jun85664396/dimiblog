var crypto = require('crypto')
  , shasum = crypto.createHash('sha1');

module.exports.addFixtures = function(model){
  var User = model.User;
  var user = User.build({
    username: 'aledesma',
    password: shasum.digest('not-a-safe-password'),
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
