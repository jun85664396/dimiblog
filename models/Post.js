module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    text: DataTypes.STRING
  },
  {
    options:
    {
      freezeTableName: true
    }
  });
  
  return Post;
}