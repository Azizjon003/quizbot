const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
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
scene.hears("Testni boshlash", (ctx) => {
  ctx.reply(
    "Testni boshlash .Biroz vaqt olishi mumkin.Nechta test yubormoqchisiz.Test faqat TUIT HUB uchun"
  );
  ctx.scene.enter("testStart");
});
module.exports = scene;
