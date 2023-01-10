const redis = require("../redis/redis");
const db = require("../database/index");
const Test = db.test;
const testEnngine = async (id) => {
  // const id = ctx.from.id;

  const test = await Test.findAll({});
  const testLength = test.length;
  let arr = [];

  for (let i = 0; i < id; i++) {
    const randNum = Math.floor(Math.random() * testLength);
    arr.push(test[randNum]);
  }
  return arr;
};
module.exports = testEnngine;
