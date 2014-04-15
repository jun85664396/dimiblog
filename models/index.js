var Sequelize = require('sequelize');

// initialize database connection
var sequelize = new Sequelize(
  'epl699',
  'root',
  '123123'
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