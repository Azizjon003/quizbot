const { Telegraf } = require("telegraf");
const configs = require("../utils/config");

const bot = new Telegraf(configs.BOT_TOKEN);
bot.on("my_chat_member", (ctx) => {
  console.log(ctx.update);
});
module.exports = bot;
