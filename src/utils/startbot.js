const configs = require("./config");

const botStart = (bot) => {
  bot.launch().then(() => {
    console.log("Aziz");
  });
  console.log(`Bot ${bot} has been started...`);
};

module.exports = botStart;
