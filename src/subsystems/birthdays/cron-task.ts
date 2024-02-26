import { schedule } from "node-cron";
import client from "$client";
import { maxMemberCountForBirthdays, defaultEmbedColor } from "$config";
import {
	getGuildBirthdayChannel,
	setGuildBirthdayChannel
} from "@database/guilds";
import log from "$logger";
import { Collection, ColorResolvable, EmbedBuilder, GuildMember, Snowflake, inlineCode, time } from "discord.js";
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
		const birthdayBois = new Collection<Snowflake, GuildMember>();
		const birthdays = new Collection<Snowflake, Date>();
		members.forEach(async (member) => {
			const birthday = await getUserBirthday(member.id);
			if (birthday == undefined) return;
			if (
				birthday.getUTCDate() == today.getUTCDate() &&
				birthday.getUTCMonth() == today.getUTCMonth()
			) {
				birthdays.set(member.id, birthday);
				birthdayBois.set(member.id, member);
			}
		});

		if (birthdayBois.size == 0) return;

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

		if (birthdayBois.size > 1) {
			let embedDesc = "";
			birthdayBois.forEach((boi) => {
				const birthday = birthdays.get(boi.id) as Date;
				embedDesc = `${boi.displayName}, who's turning ${inlineCode((today.getUTCFullYear() - birthday.getUTCFullYear()).toString())}!\n`
			});

			const embed = new EmbedBuilder()
				.setTitle("Birthday Peeps")
				.setDescription(embedDesc)
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
			const birthdayBoi = birthdayBois.at(0) as GuildMember;
			const birthday = birthdays.at(0) as Date;

			const embed = new EmbedBuilder()
				.setColor(
					birthdayBoi.user.hexAccentColor != null
						? birthdayBoi.user.hexAccentColor
						: (defaultEmbedColor as ColorResolvable)
				)
				.setTitle(birthdayBoi.displayName)
				.setThumbnail(birthdayBoi.displayAvatarURL())
				.addFields(
					{
						name: "ID",
						value: birthdayBoi.id
					},
					{
						name: "Username",
						value: birthdayBoi.user.tag
					},
					{
						name: "Joined",
						value: time(birthdayBoi.user.createdAt, "F")
					}
				);

			channel
				.send({
					content: `Good Morning @everyone!\nPlease congratulate ${birthdayBoi.displayName} on their ${inlineCode((today.getUTCFullYear() - birthday.getUTCFullYear()).toString())} birthday!`,
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
