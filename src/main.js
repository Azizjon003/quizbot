require("dotenv").config();
const { bot } = require("./core/bot");
const session = require("./core/session");
const client = require("./redis/redis");
const db = require("./database/index");
const User = db.user;
const stage = require("./scenes/index");
const botStart = require("./utils/startbot");

require("./database");
require("./redis/redis");
bot.use(session);
bot.use((ctx, next) => {
  ctx.session ?? (ctx.session = {});
  next();
});
bot.use(stage.middleware());
bot.on("poll_answer", async (ctx) => {
  const polId = ctx.update.poll_answer.poll_id;
  const userId = ctx.update.poll_answer.user.id;
  const userName =
    ctx.update.poll_answer.user.username ||
    ctx.update.poll_answer.user.first_name;
  const optionId = ctx.update.poll_answer.option_ids[0];
  let poll = await client.get(`update`);
  poll = JSON.parse(poll);
  let user = await User.findOne({
    where: {
      telegramId: userId,
    },
  });
  if (!user) {
    user = await User.create({
      telegramId: userId,
      name: userName,
    });
  }
  let userAnswer = user.soni;

  if (poll.id == polId) {
    if (optionId == poll.question) {
      userAnswer = userAnswer + 1;
      await User.update(
        {
          soni: userAnswer,
        },
        {
          where: {
            telegramId: userId,
          },
        }
      );
    }
  }
});
bot.start((ctx) => ctx.scene.enter("start"));

botStart(bot);
