const test = (sequelize, DataTypes) => {
  const test = sequelize.define("test", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    savol: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    javob: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variant1: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variant2: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variant3: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    grooupId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  });
  return test;
};

module.exports = test;
