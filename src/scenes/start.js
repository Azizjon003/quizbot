const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
const Group = db.testGroup;
const scene = new Scenes.BaseScene("start");

scene.enter(async (ctx) => {
  let text = "Siz iz bot. Sizni qaysi xizmatdan foydalanishni istaysiz?";
  const shart = await enabled(ctx, user);
  if (shart) {
    const keyboard = Markup.keyboard([
      ["Test Yuklash", "Testni boshlash"],
      ["Testlarim", "Testlarimni ko'rish"],
    ])
      .resize()
      .oneTime();
    ctx.reply(text, keyboard);
  } else {
    ctx.reply(
      "Siz admin emassiz. Admin bo'lish uchun adminlarimizga murojaat qiling.Test ishlamoqchi bo'lsangiz @tatu_tuit_hub"
    );
  }
});

scene.hears("Test Yuklash", (ctx) => {
  ctx.reply("Test yuklash uchun faylni yuboring");
  ctx.scene.enter("testUpload");
});
scene.hears("Testni boshlash", async (ctx) => {
  const id = ctx.update.message.from.id;
  const group = await Group.findAll({
    attributes: ["name"],
  });
  let arr = [];
  group.forEach((el) => {
    arr.push(el.name);
  });
  const keyboard = Markup.keyboard(arr).resize().oneTime();
  ctx.telegram.sendMessage(id, "Test Guruhlarini tanlang", keyboard);

  ctx.scene.enter("testStart");
});
module.exports = scene;
