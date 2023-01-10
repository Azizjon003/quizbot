const { Scenes } = require("telegraf");
console.log(Scenes);
const stage = new Scenes.Stage([require("./start"), require("./uploadTest")]);

module.exports = stage;
