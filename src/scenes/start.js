const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
const Group = db.testGroup;
const scene = new Scenes.BaseScene("start");
const fs = require("fs");
const path = require("path");

scene.enter(async (ctx) => {
  let text = "Siz iz bot. Sizni qaysi xizmatdan foydalanishni istaysiz?";
  console.log(ctx.update);
  const id = ctx.update.message.from.id;
  const shart = await enabled(ctx, user);
  if (shart) {
    const keyboard = Markup.keyboard([
      ["Test Yuklash", "Testni boshlash"],
      ["Guruhni almashtirish"],
    ])
      .resize()
      .oneTime();
    ctx.telegram.sendMessage(id, text, keyboard);
  } else {
    ctx.telegram.sendMessage(
      id,
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
scene.hears("Guruhni almashtirish", (ctx) => {
  const group = fs.readFileSync(path.join(__dirname, "../../groups.json"));

  const keyboard = Markup.keyboard(JSON.parse(group)).resize().oneTime();
  ctx.reply("Guruhni tanlang", keyboard);
  ctx.scene.enter("groupUpload");
});
module.exports = scene;
