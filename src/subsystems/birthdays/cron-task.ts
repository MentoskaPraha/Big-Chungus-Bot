import { schedule } from "node-cron";
import client from "$client";
import { maxMemberCountForBirthdays, defaultEmbedColor } from "$config";
import {
	getGuildBirthdayChannel,
	setGuildBirthdayChannel
} from "@database/guilds";
import log from "$logger";
import { ColorResolvable, EmbedBuilder, GuildMember, time } from "discord.js";
import { getUserBirthday } from "@database/users";

const cron = schedule("0 8 * * *", async () => {
	log.debug("Started daily birthday cron task!");

	client.guilds.cache.forEach(async (guild) => {
		const channelId = await getGuildBirthdayChannel(guild.id);

		if (channelId == undefined) return;
		if (guild.memberCount > maxMemberCountForBirthdays) {
			setGuildBirthdayChannel(guild.id);
			return;
		}

		const members = await guild.members.list({
			limit: maxMemberCountForBirthdays
		});

		const today = new Date(Date.now());
		const birthdayMsg: string[] = [];
		const birthdayBois: GuildMember[] = [];
		members.forEach(async (member) => {
			const birthday = await getUserBirthday(member.id);
			if (birthday == undefined) return;
			if (
				birthday.getUTCDate() == today.getUTCDate() &&
				birthday.getUTCMonth() == today.getUTCMonth()
			) {
				birthdayMsg.push(
					`${member.user.displayName} who is turning ${
						birthday.getUTCFullYear() - today.getUTCFullYear()
					}`
				);
				birthdayBois.push(member);
			}
		});

		if (birthdayBois.length == 0) return;

		const channel = await guild.channels.fetch(channelId);
		if (channel == null) {
			setGuildBirthdayChannel(guild.id);
			log.warn(
				`${guild.name}(${guild.id}) removed their birthday channel without unsetting it from the settings.`
			);
			return;
		}

		if (!channel.isTextBased()) {
			setGuildBirthdayChannel(guild.id);
			log.warn(
				`${guild.name}(${guild.id}) somehow managed to set a non-text based channel as their birthday announcement channel.`
			);
			return;
		}

		if (birthdayBois.length > 1) {
			const embed = new EmbedBuilder()
				.setTitle("Birthday Peeps")
				.setDescription(birthdayMsg.join("\n"))
				.setColor(defaultEmbedColor as ColorResolvable)
				.setTimestamp(Date.now())
				.setFooter({
					text: `This is a message announcing birthdays via the daily scheduled birthday function.`,
					iconURL: client.user?.displayAvatarURL()
				});

			channel
				.send({
					content:
						"Good Morning @everyone!\nPlease congratulate the attached people on their birthday!",
					embeds: [embed]
				})
				.catch((error) => {
					log.error(
						error,
						`Failed to send birthday announcement in guild ${guild.name}(${guild.id})!`
					);
					setGuildBirthdayChannel(guild.id);
				})
				.then(() =>
					log.info(
						`Sent birthday announcement in guild ${guild.name}(${guild.id})!`
					)
				);
		} else {
			const embed = new EmbedBuilder()
				.setColor(
					birthdayBois[0].user.hexAccentColor != null
						? birthdayBois[0].user.hexAccentColor
						: (defaultEmbedColor as ColorResolvable)
				)
				.setTitle(birthdayBois[0].displayName)
				.setThumbnail(birthdayBois[0].displayAvatarURL())
				.setDescription(
					birthdayBois[0].user.bot
						? "This user is a bot and not a real person."
						: null
				)
				.addFields(
					{
						name: "ID",
						value: birthdayBois[0].id
					},
					{
						name: "Username",
						value: birthdayBois[0].user.tag
					},
					{
						name: "Joined",
						value: time(birthdayBois[0].user.createdAt, "F")
					}
				);

			channel
				.send({
					content: `Good Morning @everyone!\nPlease congratulate ${birthdayBois[0].displayName} on their birthday!`,
					embeds: [embed]
				})
				.catch((error) => {
					log.error(
						error,
						`Failed to send birthday announcement in guild ${guild.name}(${guild.id})!`
					);
					setGuildBirthdayChannel(guild.id);
				})
				.then(() =>
					log.info(
						`Sent birthday announcement in guild ${guild.name}(${guild.id})!`
					)
				);
		}
	});

	log.info("Finished running daily birthday cron task.");
});

export default cron;
