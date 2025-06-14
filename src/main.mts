import { readFile } from "node:fs/promises";
import http from "node:http";
import { dirname, join } from "node:path";
import {
	ChannelType,
	Client,
	GatewayIntentBits,
	type Message,
} from "discord.js";

const appDirname = join(dirname(new URL(import.meta.url).pathname), "..");

const triggers = (await readFile(join(appDirname, "triggers.txt")))
	.toString()
	.split("\n")
	.map((row) => row.trim().toLowerCase())
	.filter((row) => row)
	.concat(
		`<@${process.env["DISCORD_BOT_ID"]}>`, // @abebot
		`<@!${process.env["DISCORD_BOT_ID"]}>`, // @abebot with nickname
	);

const responces = (await readFile(join(appDirname, "abe.txt")))
	.toString()
	.split("\n")
	.map((row) => row.trim())
	.filter((row) => row);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.DirectMessages,
	],
});

client.once("ready", () => {
	console.log("Bot is now ready!");

	client.application?.commands.set([
		{
			name: "list-words",
			description: "List all words",
		},
	]);
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

		if (
			message.channel.type === ChannelType.GuildText ||
			message.channel.type === ChannelType.DM ||
			message.channel.type === ChannelType.GuildAnnouncement
		) {
			message.channel.send(responce);
		}
	}
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === "list-words") {
		await interaction.reply({
			content: [
				"## Trigger Words",
				"",
				...triggers.map((trigger) => `* ${trigger}`),
				"",
				"## Response Words",
				"",
				...responces.map((responce) => `* ${responce}`),
			].join("\n"),
			ephemeral: true,
		});
	}
});

client.login(process.env["DISCORD_BOT_TOKEN"]);

http
	.createServer((_, res) => {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("online");
	})
	.listen(process.env["PORT"] ?? 3000);
