const { Scenes } = require("telegraf");
console.log(Scenes);
const stage = new Scenes.Stage([
  require("./start"),
  require("./uploadTest"),
  require("./test.start"),
  require("./testCount"),
  require("./groupUpload"),
]);

module.exports = stage;
