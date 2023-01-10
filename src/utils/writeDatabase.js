const db = require("../database/index");

const test = db.test;
const Group = db.testGroup;
const fs = require("fs");
const createTestEngine = async (url, group) => {
  console.log("ishla");
  const groupAdd = await Group.create({
    name: group,
  });

  const datas = JSON.parse(fs.readFileSync(url, "utf8"));
  const data = datas.questions;

  for (let i = 0; i < data.length; i++) {
    try {
      let savol = data[i];
      console.log(savol);
      let quiz = savol.question;
      const answers = savol.answers;
      let javob = answers[savol.correct_index];
      answers.splice(savol.correct_index, 1);
      console.log(quiz);
      // console.log(answers);

      // console.log(javob);
      // console.log(answers[0], answers[1], answers[2]);
      const testAdd = await test.create({
        savol: quiz,
        javob: javob,
        variant1: answers[0],
        variant2: answers[1],
        variant3: answers[2],
        grooupId: group,
      });
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports = createTestEngine;
