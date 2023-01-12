const redis = require("../redis/redis");
const db = require("../database/index");
const Test = db.test;
const testEnngine = async (id, name) => {
  // const id = ctx.from.id;
  // console.log(name);
  const test = await Test.findAll({
    where: {
      grooupId: name,
    },
  });
  // console.log("Test", test);
  const testLength = test.length;
  let arr = [];

  for (let i = 0; i < id; i++) {
    const randNum = Math.floor(Math.random() * testLength);
    arr.push(test[randNum]);
  }
  console.log("Uzunligi", arr.length);
  // console.log(arr);
  return arr;
};
module.exports = testEnngine;
