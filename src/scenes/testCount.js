const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const User = db.user;
const scene = new Scenes.BaseScene("testCount");

const shuffle = require("../utils/shuffle");

const testEnngine = require("../utils/testEngine");
const client = require("../redis/redis");
function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() < start + delay);
}

scene.hears("Stop", async (ctx) => {
  ctx.reply("Test to'xtatildi");
  await client.set("stop", "true");
  ctx.scene.enter("start");
  return;
});
scene.on("message", async (ctx) => {
  const shart = await enabled(ctx, User);
  const id = ctx.update.message.from.id;
  if (shart) {
    const groupId = await client.get(`group`);
    const text = ctx.update.message.text.split(" ")[0];
    console.log(text);
    let sleepTime = Number(ctx.update.message.text.split(" ")[1]);
    console.log(sleepTime);
    const groupName = await client.get(`${id}:group`);
    // console.log(groupName);
    const data = await testEnngine(text, groupName);
    let quiz = ["2️⃣", "3️⃣", "KETDIK"];
    let msg = await ctx.telegram.sendMessage(groupId, "1️⃣");

    for (let i = 0; i < quiz.length; i++) {
      sleep(500);
      msg = await ctx.telegram.editMessageText(
        groupId,
        msg.message_id,
        null,
        quiz[i]
      );
    }
    sleep(500);
    await ctx.telegram.deleteMessage(groupId, msg.message_id);

    const keyboard = Markup.keyboard([["Stop"]])
      .resize()
      .oneTime();
    await ctx.telegram.sendMessage(
      id,
      "Testni to'xtish uchun Stop tugmasini bosing",
      keyboard
    );

    for (let i = 0; i < data.length; i++) {
      // console.log(data[i]);
      const ishla = await client.get("stop");
      if (ishla == "true") {
        client.set("stop", "false");
        break;
      }
      const savol = data[i].savol;
      let trueAnswer = data[i].javob;
      let quizArr = [
        data[i].javob,
        data[i].variant1,
        data[i].variant2,
        data[i].variant3,
      ];
      const txt = `[${i + 1}/${text}]` + savol;
      let randArr = shuffle(quizArr);
      let a;
      for (let j = 0; j < randArr.length; j++) {
        if (randArr[j] == trueAnswer) {
          a = j;
        }
      }

      if (savol && quizArr) {
        // console.log(savol);
        if (txt.length > 300) {
          await ctx.telegram.sendMessage(groupId, txt);
          const upt = await ctx.telegram.sendPoll(groupId, "savol", quizArr, {
            type: "quiz",
            is_anonymous: false,
            correct_option_id: a,
            open_period: sleepTime,
          });
          const taxla = {
            id: upt.poll.id,
            question: upt.poll.correct_option_id,
          };

          await client.set("update", JSON.stringify(taxla));
        }
        if (
          quizArr[0].length > 100 ||
          quizArr[1].length > 100 ||
          quizArr[2].length > 100 ||
          quizArr[3].length > 100
        ) {
          await ctx.telegram.sendMessage(
            groupId,
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
          const upt = await ctx.telegram.sendPoll(
            groupId,
            "savol",
            ["A", "B", "C", "D"],
            {
              type: "quiz",
              is_anonymous: false,
              correct_option_id: a,
              open_period: sleepTime,
            }
          );

          const taxla = {
            id: upt.poll.id,
            question: upt.poll.correct_option_id,
          };

          await client.set("update", JSON.stringify(taxla));
        }
        if (
          txt.length < 300 &&
          quizArr[0].length < 100 &&
          quizArr[1].length < 100 &&
          quizArr[2].length < 100 &&
          quizArr[3].length < 100
        ) {
          const upt = await ctx.telegram.sendPoll(groupId, txt, quizArr, {
            type: "quiz",
            is_anonymous: false,
            correct_option_id: a,
            open_period: sleepTime,
          });
          const taxla = {
            id: upt.poll.id,
            question: upt.poll.correct_option_id,
          };

          await client.set("update", JSON.stringify(taxla));
        }
      }
      await sleep(sleepTime * 1000);
    }
    await ctx.telegram.sendMessage(groupId, "Test yakunlandi");
    sleep(500);
    const user = await User.findAll({
      where: {
        [db.Op.not]: [{ soni: 0 }],
      },
      order: [["soni", "DESC"]],
    });

    let answerText = `<i>🏁 The quiz '${groupName}' has finished!</i>`;
    let j = 1;
    user.forEach((el) => {
      let t = `\n<b>${j++}</b>  <i>${el.name} - ${
        el.soni
      } </i> (vaqti bo'ladi)\n`;
      answerText = answerText + t;
    });

    answerText = answerText + "Testda ishlirok etganlarni tabriklaymiz";
    ctx.telegram.sendMessage(groupId, answerText, {
      parse_mode: "HTML",
    });

    for (let i = 0; i < user.length; i++) {
      await User.update(
        {
          soni: 0,
        },
        {
          where: {
            id: user[i].id,
          },
        }
      );
    }

    ctx.scene.enter("start");
  }
});

module.exports = scene;
