const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
const scene = new Scenes.BaseScene("testUpload");
const axios = require("axios");
const fs = require("fs");
const createTestEngine = require("../utils/writeDatabase");

scene.on("document", async (ctx) => {
  const shart = await enabled(ctx, user);
  const id = ctx.update.message.from.id;
  if (shart) {
    const doc = ctx.update.message.document;
    const type = doc.file_name.split(".")[1];

    const filesize = doc.file_size / 1024 / 1024;
    if (filesize > 20) {
      return ctx.telegram.sendMessage(id, "Fayl hajmi kattaroq ekan.");
    }
    const fileId = doc.file_id;
    const getLink = await ctx.telegram.getFileLink(fileId);

    const data = await axios.get(getLink.href, { responseType: "stream" });

    const time = new Date().getTime();
    const url = `${__dirname}/files/${time}.${type}`;
    await data.data.pipe(fs.createWriteStream(url));
    await ctx.telegram.sendMessage(
      id,
      "File qabul qilindi.Testlar yuklanmoqda kutib turishingizni so'rayman"
    );
    console.log("bfdsjbfdsfds");
    await createTestEngine(url, time);
  }
});
module.exports = scene;
