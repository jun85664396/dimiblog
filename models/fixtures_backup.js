var crypto = require('crypto');

module.exports.addFixtures = function(model){
  var User = model.User;
  var hash = crypto.createHash('sha1');
  hash.update('123123', 'utf8');
  var user = User.build({
    username: 'haris',
    password: hash.digest('hex'),
    email: 'haris@cs.ucy.ac.cy'
  });
  user
    .save()
    .complete(function(err){
      if (!!err) {
        //console.log('The instance has not been saved:', err);
      } else {
        //console.log('We have a persisted instance now');
        var Post = model.Post;
        Post
        .create({ 
          text: 'I am tempted to write a single hello world... and this is another post btw' 
        })
        .complete(function(error, post){
          user.addPost(post).success(function(){
            console.log('We have a post!');
          });
        });
      }
    });
};
