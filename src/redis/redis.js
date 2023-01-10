const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || "http://127.0.0.1";
const HOST = process.env.HOST || 6379;
const redis = require("redis");
const client = redis.createClient({});

client
  .connect(PORT, HOST, () => {})
  .then(() => {
    console.log("Redis connected");
  })
  .catch((err) => console.log(err));

module.exports = client;
