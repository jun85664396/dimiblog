module.exports = function(sequelize, DataTypes) {
  var Connection = sequelize.define('Connection', {
    username: DataTypes.STRING,
    url: DataTypes.STRING
  },
  {
    options:
    {
      freezeTableName: true
    }
  });
  
  return Connection;
}