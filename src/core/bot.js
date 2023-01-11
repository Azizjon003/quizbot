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
    // console.log(id);
    let timeTrue = await client.get(`${id}:time`);

    timeTrue = Number(timeTrue);
    const time = Math.floor(new Date().getTime() / 1000);
    if (time == timeTrue) {
      let data = await client.get(`${id}:savol`);
      console.log(data);
      data = await JSON.parse(data);
      if (data.length <= 0) {
        let natija = await client.get(`${id}:recently`);
        console.log(natija);
        let currentText = "";
        natija = await JSON.parse(natija);
        for (let i = 0; i < natija.length; i++) {
          let indx = await client.get(`${natija[i]}`);
          indx = await JSON.parse(indx);
          let indxTxt = `${i + 1} - ${indx.first_name} - ${indx.soni} \n`;
          // currentText = currentText + indxTxt;
          await bot.telegram.sendMessage("-1001886562461 ", indxTxt);
        }
        job.stop();
        return 0;
      }
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

      console.log(savol);
      console.log(quizArr);
      console.log(a);
      if (savol && quizArr) {
        if (txt.length > 300) {
          await bot.telegram.sendMessage("-1001886562461 ", txt);
          await bot.telegram.sendPoll("-1001886562461 ", "savol", quizArr, {
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
            "-1001886562461 ",
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
          await bot.telegram.sendPoll(
            "-1001886562461 ",
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
          quizArr[0].length < 100 &&
          quizArr[1].length < 100 &&
          quizArr[2].length < 100 &&
          quizArr[3].length < 100
        ) {
          await bot.telegram.sendPoll("-1001886562461", txt, quizArr, {
            type: "quiz",
            is_anonymous: false,
            correct_option_id: a,
            open_period: 30,
          });
        }
      }
      await client.set("recently", JSON.stringify(a));
      data.splice(data[0], 1);
      console.log("Sovuq");
      await client.set(`${id}:savol`, JSON.stringify(data));
      await client.set(`${id}:true`, JSON.stringify(a));
      await client.set(`${id}:count`, String(Number(text) + 1));
      await client.set(
        `${id}:time`,
        JSON.stringify(Math.floor(new Date().getTime() / 1000) + 30)
      );
    } else {
      // console.log("E ishla endi");
    }
    bot.on("poll_answer", async (ctx) => {
      const idcha = ctx.update.poll_answer.user.id;
      let datacha = await client.get(`${idcha}`);
      datacha = await JSON.parse(datacha);
      let javob = await client.get(`recently`);
      const answer = ctx.update.poll_answer.option_ids[0];
      console.log(datacha);
      if (!datacha) {
        const first_name = ctx.update.poll_answer.user.first_name;
        let obj = {};
        obj.id = idcha;
        obj.first_name = first_name;
        let soni = 0;
        if (answer == javob) {
          soni = 1;
        }
        console.log(soni);
        obj.soni = soni;
        await client.set(`${idcha}`, JSON.stringify(obj));
      } else {
        let soni = Number(datacha?.soni) || 0;
        if (answer == javob) {
          soni = soni + 1;
        }
        console.log(datacha);
        console.log(typeof datacha);
        datacha.soni = soni;
        await client.set(`${idcha}`, JSON.stringify(datacha));
      }
      let usersData = await client.get(`${id}:recently`);
      usersData = await JSON.parse(usersData);
      if (usersData.length > 0) {
        if (!usersData.includes(idcha)) {
          let arrr = usersData.push(idcha);
          await client.set(`${id}:recently`, JSON.stringify(arrr));
        }
      } else {
        let usersData = [];
        usersData.push(idcha);
        await client.set(`${id}:recently`, JSON.stringify(usersData));
      }
    });
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();

bot.on("my_chat_member", (ctx) => {
  console.log(ctx.update);
});

module.exports = { bot, job };
