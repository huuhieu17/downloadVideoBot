// Env Config
require("dotenv").config();
const env = process.env;
const TelegramBot = require("node-telegram-bot-api");
const token = env.TELEGRAM_TOKEN || "token"; //
const bot = new TelegramBot(token, { polling: true });

const express = require("express");
const GetVideo = require("./modules/getVideo");
const app = express();
const port = env.APP_PORT || 3000;

// Bot listen message here:
bot.onText(/(fb\.watch|facebook\.com)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = msg.text; // the captured "whatever"

  const matches = resp.match(
    /\bhttps?:\/\/(?:www\.)?(facebook\.com|fb\.com|fb\.watch)\/(?:watch\/?\?v=|video\.php\?v=|reel\/|[\w-]+\/|stories\/[\w/+-]+\/)/g
  );
  // Check if any matches are found
  if (matches) {
    matches.forEach(async (match) => {
      try {
        const { data } = await GetVideo(match, "facebook");
        if (!data) return;

        const { message, attachments } = data;
        if (attachments && attachments.length > 0) {
          bot.sendVideo(
            chatId,
            attachments[0].url.hd ?? attachments[0].url?.sd,
            {
              reply_to_message_id: msg.message_id,
              caption: message,
            }
          );
        }
      } catch (e) {
        console.log(e);
        bot.sendMessage(chatId, "Some thing went wrong", {
          reply_to_message_id: msg.message_id,
        });
      }
    });
  } else {
    console.log("No Facebook links found.");
  }
});

bot.onText(/tiktok.com/, (msg, match) => {
    const chatId = msg.chat.id;
  const resp = msg.text; // the captured "whatever"

  const matches = resp.match(/https?:\/\/(www\.|m\.|vt\.)tiktok\.com\/(v\/|@[\w.-]+\/video\/|[\w-]+\/)?(\d+|[\w-]+)/g);
  // Check if any matches are found
  if (matches) {
    matches.forEach(async (match) => {
      try {
        const { data } = await GetVideo(match, "tiktok");
        console.log(data);
        if (!data) return;

        const { message, attachments } = data;
        if (attachments && attachments.length > 0) {
          bot.sendVideo(
            chatId,
            attachments[0].url,
            {
              reply_to_message_id: msg.message_id,
              caption: message,
            }
          );
        }
      } catch (e) {
        console.log(e);
        bot.sendMessage(chatId, "Some thing went wrong", {
          reply_to_message_id: msg.message_id,
        });
      }
    });
  } else {
    console.log("No tiktok links found.");
  }
})

// on message
bot.on("message", async (msg) => {
    var messageId = msg.message_id;
    if (msg.text) {
      const text = msg.text.trim();
      const chatId = msg.chat.id;

      //start
      if (text.startsWith("/start")) {
        bot.sendMessage(chatId, "Xin chào \n OK", {
          reply_to_message_id: msg.message_thread_id
        });
      }
    }
})

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
