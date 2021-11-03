import http from "http";
import fs from "fs";
import path from "path";
import { Client, Intents } from "discord.js";

(async () => {
  const triggers = (
    await fs.promises.readFile(path.resolve(__dirname, "..", "triggers.txt"), {
      encoding: "utf-8",
    })
  )
    .split("\n")
    .map((row) => row.trim().toLowerCase())
    .filter((row) => row)
    .concat("<@!902522751930224660>", "<@!435448025301647361>");

  const responces = (
    await fs.promises.readFile(path.resolve(__dirname, "..", "abe.txt"), {
      encoding: "utf-8",
    })
  )
    .split("\n")
    .map((row) => row.trim().toLowerCase())
    .filter((row) => row);

  http
    .createServer(function (req, res) {
      res.write("online");
      res.end();
    })
    .listen(8080);

  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  });

  client.on("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    console.log(`[MESSAGE]: ${message.content}`);

    if (
      triggers.some((trigger) =>
        message.content?.toLowerCase().includes(trigger)
      )
    ) {
      message.channel.send(
        responces[Math.round(Math.random() * responces.length)]
      );
    }
  });

  client.login(process.env["TOKEN"]);
})();
