const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
const scene = new Scenes.BaseScene("testStart");
const axios = require("axios");
const redis = require("../redis/redis");
const fs = require("fs");
const shuffle = require("../utils/shuffle");
const createTestEngine = require("../utils/writeDatabase");
const testEnngine = require("../utils/testEngine");

scene.hears(/^-?\d*\.?\d*$/, async (ctx) => {
  const shart = await enabled(ctx, user);
  const id = ctx.update.message.from.id;
  if (shart) {
    const text = ctx.update.message.text;
    const data = await testEnngine(text);
    const savol = data[0].savol;
    let trueAnswer = data[0].javob;
    let quizArr = [
      data[0].javob,
      data[0].variant1,
      data[0].variant2,
      data[0].variant3,
    ];
    const txt = `1/[${text}]` + savol;
    let randArr = shuffle(quizArr);
    let a;
    for (let i = 0; i < randArr.length; i++) {
      if (randArr[i] == trueAnswer) {
        a = i;
      }
    }
    if (savol && quizArr && a) {
      if (txt.length > 300) {
        await ctx.telegram.sendMessage("-1001480317018", txt);
        await ctx.telegram.sendPoll("-1001480317018", "savol", quizArr, {
          type: "quiz",
          is_anonymous: false,
          correct_option_id: a,
          open_period: 30,
        });
      }
      if (
        quizArr[0].length > 100 ||
        quizArr.length[1] > 100 ||
        quizArr.length[2] > 100 ||
        quizArr.length[3] > 100
      ) {
        await ctx.telegram.sendMessage(
          "-1001480317018",
          txt +
            "\n" +
            quizArr[0] +
            "\n" +
            quizArr[1] +
            "\n" +
            quizArr[2] +
            "\n" +
            quizArr[3]
        );
        await ctx.telegram.sendPoll(
          "-1001480317018",
          "savol",
          ["A", "B", "C", "D"],
          {
            type: "quiz",
            is_anonymous: false,
            correct_option_id: a,
            open_period: 30,
          }
        );
      }
      if (
        txt.length < 300 &&
        (quizArr[0].length < 100 ||
          quizArr[1].length < 100 ||
          quizArr[2].length < 100 ||
          quizArr[3].length < 100)
      ) {
        await ctx.telegram.sendPoll("-1001480317018", savol, quizArr, {
          type: "quiz",
          is_anonymous: false,
          correct_option_id: a,
          open_period: 30,
        });
      }
    }
    data.splice(data[0], 1);
    redis.set(`${id}`, JSON.stringify(data));
  }
});
module.exports = scene;
