const { Telegraf } = require("telegraf");
const configs = require("../utils/config");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const client = require("../redis/redis");
const shuffle = require("../utils/shuffle");
var CronJob = require("cron").CronJob;
const bot = new Telegraf(configs.BOT_TOKEN);

const job = new CronJob(
  "* * * * * *",
  async () => {
    const id = Number(fs.readFileSync(path.join(__dirname, "../../id.txt")));
    console.log(id);
    let timeTrue = await client.get(`${id}:time`);

    timeTrue = Number(timeTrue);
    const time = Math.floor(new Date().getTime() / 1000);

    console.log("salom", timeTrue);
    console.log("salom time", time);
    if (time == timeTrue) {
      let data = await client.get(`${id}`);
      data = JSON.parse(data);
      const savol = data[0].savol;
      let trueAnswer = data[0].javob;
      let quizArr = [
        data[0].javob,
        data[0].variant1,
        data[0].variant2,
        data[0].variant3,
      ];
      let text = await client.get(`${id}:count`);
      let soni = await client.get(`${id}:soni`);
      const txt = `[${text}/${soni}]` + savol;
      let randArr = shuffle(quizArr);

      let a;
      for (let i = 0; i < randArr.length; i++) {
        if (randArr[i] == trueAnswer) {
          a = i;
        }
      }

      if (savol && quizArr && a) {
        if (txt.length > 300) {
          await bot.telegram.sendMessage("-1001480317018", txt);
          await bot.telegram.sendPoll("-1001480317018", "savol", quizArr, {
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
          await bot.telegram.sendMessage(
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
          await bot.telegram.sendPoll(
            "-1001480317018",
            "savol",
            ["A", "B", "C", "D"],
            {
              type: "quiz",
              is_anonymous: false,
              correct_option_id: a,
              open_period: 10,
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
          await bot.telegram.sendPoll("-1001480317018", txt, quizArr, {
            type: "quiz",
            is_anonymous: false,
            correct_option_id: a,
            open_period: 10,
          });
        }
      }
      data.splice(data[0], 1);
      console.log("Sovuq");
      await client.set(`${id}`, JSON.stringify(data));
      await client.set(`${id}:true`, JSON.stringify(a));
      await client.set(`${id}:count`, String(Number(text) + 1));
      await client.set(
        `${id}:time`,
        JSON.stringify(Math.floor(new Date().getTime() / 1000) + 10)
      );
    } else {
      console.log("E ishla endi");
    }
    // bot.on("poll_answer", (ctx) => {

    // });
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
module.exports = bot;
