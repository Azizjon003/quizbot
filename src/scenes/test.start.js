const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
const scene = new Scenes.BaseScene("testStart");
const axios = require("axios");
const redis = require("../redis/redis");
const fs = require("fs");
const path = require("path");
const idcha = JSON.stringify(
  fs.readFileSync(path.join(__dirname, "../../id.txt"))
);
const client = require("../redis/redis");

scene.hears(/^-?\d*\.?\d*$/, async (ctx) => {
  const shart = await enabled(ctx, user);
  const id = ctx.update.message.from.id;
  if (shart) {
    const text = ctx.update.message.text;
    console.log(id);
    console.log(text);
    await client.set(`${id}:group`, text);
    ctx.reply("Testni boshlash uchun endi test sonini kiriting");
    ctx.scene.enter("testCount");
  }
});

module.exports = scene;
