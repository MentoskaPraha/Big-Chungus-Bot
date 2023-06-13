import { ActivityType, Client, Events } from "discord.js";
import log from "$lib/logger";
import { eventList } from "$events";
import { disconnectDB } from "$lib/databaseAPI";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { delay } from "$lib/utilities";

const botStateSlice = createSlice({
	name: "botState",
	initialState: {
		processCount: 0,
		maintenanceMode: false
	},
	reducers: {
		processStarted(state) {
			state.processCount += 1;
		},
		processEnded(state) {
			state.processCount -= 1;
		},
		maintenanceModeToggledOn(state) {
			state.maintenanceMode = true;
		},
		maintenanceModeToggledOff(state) {
			state.maintenanceMode = false;
		}
	}
});

const botStateStore = configureStore({
	reducer: botStateSlice.reducer
});

export async function processCountChange(increase: boolean) {
	increase
		? botStateStore.dispatch(botStateSlice.actions.processStarted())
		: botStateStore.dispatch(botStateSlice.actions.processEnded());
}

export function getMaintenanceModeState() {
	return botStateStore.getState().maintenanceMode;
}

export async function maintenanceModeToggle(newValue: boolean, client: Client) {
	newValue
		? botStateStore.dispatch(
				botStateSlice.actions.maintenanceModeToggledOn()
		  )
		: botStateStore.dispatch(
				botStateSlice.actions.maintenanceModeToggledOff()
		  );

	//update bot depending on state
	if (botStateStore.getState().maintenanceMode) {
		//stop unneccessry requests
		eventList.forEach((event) => {
			if (event.name == Events.ShardError) return;
			if (event.name === Events.ShardDisconnect) return;
			if (event.name === Events.InteractionCreate) return;
			if (event.once) return;
			client.off(event.name, (...args) => event.execute(...args));
		});

		client.user?.setPresence({
			activities: [
				{
					name: "Maintenance",
					type: ActivityType.Watching
				}
			],
			status: "idle"
		});
	} else {
		eventList.forEach((event) => {
			if (event.name == Events.ShardError) return;
			if (event.name === Events.ShardDisconnect) return;
			if (event.name === Events.InteractionCreate) return;
			if (event.once) return;
			client.on(event.name, (...args) => event.execute(...args));
		});

		client.user?.setPresence({
			activities: [
				{
					name: "The Big Chungus Relegion",
					type: ActivityType.Watching
				}
			],
			status: "online"
		});
	}
}

export async function errorShutdown(
	client: Client | null,
	error: unknown,
	msg: string
) {
	await disconnectDB();
	if (client != null) client.destroy();
	log.fatal(error, msg);
	log.flush();
	process.exit(1);
}

export async function shutdown(client: Client) {
	log.warn("Started shutdown sequence...");

	//set presence to let users know of the shutdown
	client.user?.setPresence({
		activities: [
			{
				name: "Shutdown",
				type: ActivityType.Watching
			}
		],
		status: "dnd"
	});

	//remove all event listeners from client
	log.info("Stopping new requests...");
	eventList.forEach((event) => {
		if (event.name == Events.ShardError) return;
		if (event.name === Events.ShardDisconnect) return;
		if (event.once) return;
		client.off(event.name, (...args) => event.execute(...args));
	});

	//wait until command execution is finished
	log.info("Waitting for code execution to finish...");
	while (botStateStore.getState().processCount == 0) {
		await delay(100);
	}

	//close database connections
	log.info("Closing database connections...");
	await disconnectDB();

	//disconnect the bot from Discord
	log.info("Disconnecting from Discord...");
	client.destroy();

	//exit the application
	log.info("Shutdown Sequence complete. Terminating process...");
	log.flush();
	process.exit(0);
}
