var Sequelize = require('sequelize');
var config = require('../config');

// initialize database connection
var dbconfig = config();
var sequelize = new Sequelize(
  dbconfig.database,
  dbconfig.user,
  dbconfig.password
);

// load models
var models = [
  'Post',
  'User'
];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// describe relationships
(function(m) {
  m.Post.belongsTo(m.User);
  m.User.hasMany(m.Post);
})(module.exports);

// export connection
module.exports.sequelize = sequelize;