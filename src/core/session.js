const configs = require("../utils/config");

const RedisConnection = require("telegraf-session-redis");

const { session: memorySession } = require("telegraf");
const session =
  configs.SESSION_TYPE === "redis"
    ? new RedisSession({
        store: {
          host: configs.REDIS_HOST || "127.0.0.1",
          port: configs.REDIS_PORT || 6379,
        },
      })
    : memorySession();

module.exports = session;
