const redis = require("../test/index");
const db = require("../model/index");
const Test = db.test;
export const testEnngine = async (id) => {
  // const id = ctx.from.id;

  const test = await Test.findAll({});
  const testLength = test.length;
  let arr = [];

  for (let i = 0; i < testLength; i++) {
    arr.push(test[i]);
  }
  return arr;
};
