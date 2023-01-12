const users = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telegramId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM,
      values: ["admin", "user"],
      allowNull: false,
      defaultValue: "user",
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    group: {
      type: DataTypes.STRING,
    },
    soni: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
  return users;
};

module.exports = users;
