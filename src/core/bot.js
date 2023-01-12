const { Telegraf } = require("telegraf");
const configs = require("../utils/config");
const cron = require("node-cron");
const bot = new Telegraf(configs.BOT_TOKEN);

module.exports = { bot };
