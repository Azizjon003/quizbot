const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
const Group = db.testGroup;
const scene = new Scenes.BaseScene("groupUpload");
const fs = require("fs");
const path = require("path");
const client = require("../redis/redis");

scene.hears(/^-?\d*\.?\d*$/, async (ctx) => {
  const text = ctx.update.message.text;

  await client.set("group", text);
  ctx.reply("Guruh Qabul qilindi");
  ctx.scene.enter("start");
});
module.exports = scene;
