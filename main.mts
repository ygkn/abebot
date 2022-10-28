import { Message, Client } from "discord.js";
import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import http from "node:http";

dotenv.config();

const appDirname = dirname(new URL(import.meta.url).pathname);

const triggers = (await readFile(join(appDirname, "triggers.txt")))
  .toString()
  .split("\n")
  .map((row) => row.trim().toLowerCase())
  .filter((row) => row)
  .concat(
    `<@${process.env["DISCORD_BOT_ID"]}>`, // @abebot
    `<@!${process.env["DISCORD_BOT_ID"]}>` // @abebot with nickname
  );

const responces = (await readFile(join(appDirname, "abe.txt")))
  .toString()
  .split("\n")
  .map((row) => row.trim())
  .filter((row) => row);

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.once("ready", () => {
  console.log("Bot is now ready!");
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) return;

  const messageContent = message.content.toLowerCase();

  if (process.env["NODE_ENV"] !== "production") {
    console.log(message.content);
  }

  if (triggers.some((trigger) => messageContent.includes(trigger))) {
    const responce = responces[Math.floor(Math.random() * responces.length)];

    if (!responce) {
      throw new Error("人生最高！");
    }

    message.channel.send(responce);
  }
});

client.login(process.env["DISCORD_BOT_TOKEN"]);

http
  .createServer((_, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("online");
  })
  .listen(process.env["PORT"] ?? 3000);
