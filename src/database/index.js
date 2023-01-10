const { Sequelize, DataTypes, Op } = require("sequelize");

const dotenv = require("dotenv");
const configs = require("../utils/config");
dotenv.config({});

const sequelize = new Sequelize(
  configs.DB,
  "postgres",
  String(configs.DB_PASS),
  {
    host: "localhost",
    dialect: "postgres",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log("not connected");
  });

let db = {};
db.sequelize = sequelize;
db.Op = Op;
db.user = require("./user")(sequelize, DataTypes);
db.test = require("./test")(sequelize, DataTypes);
db.testGroup = require("./group")(sequelize, DataTypes);
// db.sequelize
//   .sync({ force: true })
//   .then(() => {
//     console.log("synced");
//   })
//   .catch((err) => {
//     console.log("not synced");
//   });

module.exports = db;
