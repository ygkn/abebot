import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.78.0/path/mod.ts";
import { startBot } from "https://deno.land/x/discordeno@12.0.1/mod.ts";
import { listenAndServe } from "https://deno.land/std@0.111.0/http/server.ts";
import { Env } from "https://deno.land/x/env@v2.2.0/env.js";

const env = new Env();

const cwd = dirname(fromFileUrl(import.meta.url));

const readlines = async (filename: string): Promise<string[]> =>
  (
    await Deno.readTextFile(join(cwd, filename))
  )
    .split("\n")
    .map((row) => row.trim().toLowerCase())
    .filter((row) => row);

const serveHttp = () =>
  listenAndServe(`:${env.get("PORT", "8080")}`, () => new Response("online", { status: 200 }));

const serveBot = async () => {
  const triggers = (await readlines("triggers.txt")).concat(
    "<@!902522751930224660>", // @AbeBot
    "<@!435448025301647361>", // @阿部健太朗
  );

  const responces = await readlines("abe.txt");

  startBot({
    token: env.require("TOKEN"),
    intents: ["Guilds", "GuildMessages"],
    eventHandlers: {
      ready() {
        console.log("Bot is now ready!");
      },
      messageCreate(message) {
        const author = message.member;
        if (author && author.bot) return;

        const content = message.content;

        console.log(`[MESSAGE]: ${content}`);

        if (content === undefined) {
          return;
        }

        if (
          triggers.some((trigger) => content.toLowerCase().includes(trigger))
        ) {
          message.send(
            responces[Math.floor(Math.random() * responces.length)],
          );
          return;
        }
      },
    },
  });
};

await Promise.all(
  [
    serveHttp(),
    serveBot(),
  ],
);
