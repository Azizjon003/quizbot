const { Scenes, Markup } = require("telegraf");
const db = require("../database/index");
const enabled = require("../utils/enanble");
const user = db.user;
const scene = new Scenes.BaseScene("testStart");
const axios = require("axios");
const fs = require("fs");
const createTestEngine = require("../utils/writeDatabase");

scene.hears(/^-?\d*\.?\d*$/, async (ctx) => {
  const shart = await enabled(ctx, user);
  const id = ctx.update.message.from.id;
  if (shart) {
    const text = ctx.update.message.text;
  
  }
});
module.exports = scene;
