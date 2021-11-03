import http from "http";
import fs from "fs";
import path from "path";
import { Client, Intents } from "discord.js";

const readlines = async (filename: string): Promise<string[]> =>
  (
    await fs.promises.readFile(path.resolve(__dirname, "..", filename), {
      encoding: "utf-8",
    })
  )
    .split("\n")
    .map((row) => row.trim().toLowerCase())
    .filter((row) => row);

(async () => {
  const triggers = (await readlines("triggers.txt")).concat(
    "<@!902522751930224660>", // @AbeBot
    "<@!435448025301647361>" // @阿部健太朗
  );

  const responces = await readlines("abe.txt");

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
        responces[Math.floor(Math.random() * responces.length)]
      );
    }
  });

  client.login(process.env["TOKEN"]);
})();
