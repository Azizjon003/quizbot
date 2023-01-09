const { Scenes, Markup } = require("telegraf");

const scene = new Scenes.BaseScene("start");

scene.enter((ctx) => {
  let text = "Siz iz bot. Sizni qaysi xizmatdan foydalanishni istaysiz?";
  const keyboard = Markup.keyboard([
    ["Test Yuklash", "Test tanlash"],
    ["Testlarim", "Testlarimni ko'rish"],
  ])
    .resize()
    .oneTime();
  ctx.reply(text, keyboard);
});

module.exports = scene;
