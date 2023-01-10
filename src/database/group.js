const group = (sequelize, DataTypes) => {
  const group = sequelize.define("group", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return group;
};

module.exports = group;
