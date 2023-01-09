const { Telegraf } = require("telegraf");
const configs = require("../utils/config");

const bot = new Telegraf(configs.BOT_TOKEN);

module.exports = bot;
