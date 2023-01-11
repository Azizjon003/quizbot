const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
const scene = new Scenes.BaseScene("testStart");
const axios = require("axios");
const redis = require("../redis/redis");
const fs = require("fs");
const path = require("path");
const idcha = JSON.stringify(
  fs.readFileSync(path.join(__dirname, "../../id.txt"))
);
const shuffle = require("../utils/shuffle");
const createTestEngine = require("../utils/writeDatabase");
const testEnngine = require("../utils/testEngine");
const client = require("../redis/redis");
const { job } = require("../core/bot");

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
    const txt = `[1/${text}]` + savol;
    let randArr = shuffle(quizArr);
    let a;
    for (let i = 0; i < randArr.length; i++) {
      if (randArr[i] == trueAnswer) {
        a = i;
      }
    }

    if (savol && quizArr) {
      console.log(savol);
      if (txt.length > 300) {
        await ctx.telegram.sendMessage("-1001886562461", txt);
        await ctx.telegram.sendPoll("-1001886562461", "savol", quizArr, {
          type: "quiz",
          is_anonymous: false,
          correct_option_id: a,
          open_period: 30,
        });
      }
      if (
        quizArr[0].length > 100 ||
        quizArr[1].length > 100 ||
        quizArr[2].length > 100 ||
        quizArr[3].length > 100
      ) {
        await ctx.telegram.sendMessage(
          "-1001886562461",
          txt +
            "\n A)" +
            quizArr[0] +
            "\n B)" +
            quizArr[1] +
            "\n C)" +
            quizArr[2] +
            "\n D)" +
            quizArr[3]
        );
        await ctx.telegram.sendPoll(
          "-1001886562461",
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
        quizArr[0].length < 100 &&
        quizArr[1].length < 100 &&
        quizArr[2].length < 100 &&
        quizArr[3].length < 100
      ) {
        await ctx.telegram.sendPoll("-1001886562461", txt, quizArr, {
          type: "quiz",
          is_anonymous: false,
          correct_option_id: a,
          open_period: 30,
        });
      }
    }
    await client.set("recently", JSON.stringify(a));
    data.splice(data[0], 1);

    await client.set(`${id}:savol`, JSON.stringify(data));
    await client.set(`${id}:true`, JSON.stringify(a));
    await client.set(
      `${id}:time`,
      JSON.stringify(Math.floor(new Date().getTime() / 1000) + 30)
    );
    await client.set(`${id}:count`, String(1 + 1));
    await client.set(`${id}:soni`, String(text));
    job.start();
    const keyboard = Markup.keyboard([["Stop"]])
      .resize()
      .oneTime();
    await ctx.telegram.sendMessage(
      id,
      "Testni to'xtish uchun Stop tugmasini bosing",
      keyboard
    );
  }
});

scene.hears("Stop", async (ctx) => {
  ctx.reply("Test to'xtatildi");
  job.stop();
  let datas = await client.get(`${idcha}:recently`);
  datas = (await JSON.parse(datas)) || [];
  if (datas.length > 0) {
    for (let i = 0; i < datas.length; i++) {
      await client.set(`${datas[i]}`, null);
    }
    await client.set(`${idcha}:recently`, null);
  }
  ctx.scene.enter("start");
});

module.exports = scene;
