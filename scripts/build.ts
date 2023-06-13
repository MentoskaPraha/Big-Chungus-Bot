import shell from "shelljs";
import pino from "pino";
import pretty from "pino-pretty";
import PromptSync from "prompt-sync";
import { existsSync } from "node:fs";

//* Logger set-up
//set up logger
const streams = [
	{
		stream: pino.destination({
			dest: __dirname + "/build.log",
			append: true,
			sync: true
		})
	},
	{ stream: pretty({ colorize: true, sync: true }) }
];

//create logger
const log = pino({ level: "info" }, pino.multistream(streams));

//* Build requirement check and set-up
//check if the project is linted
log.info("Checking script requirements...");

if (shell.exec("yarn lint").code == 1) {
	log.fatal(
		"The project is not correctly formatted or has other issue, please run `yarn lint` for more details."
	);
	process.exit(1);
}

//check if docker is running
if (shell.exec("docker info").code == 1) {
	log.fatal(
		"Please ensure that the Docker Deamon is running and can be connected to.\nTry running this command with sudo permissions, like so: `sudo !!`"
	);
	process.exit(1);
}

//get docker image name
log.info("Getting image name and tag...");

const prompt = PromptSync({ sigint: true });
console.log(
	"Welcome to the Big Chungus Bot build tool!\nPlease input a Docker Image name:"
);
let imageName = prompt("");
let loop = true;
while (loop) {
	if (/:/i.test(imageName)) {
		console.log(
			"Invalid Input. The `:` character is reserved.\nPlease try again."
		);
		imageName = prompt("");
	} else loop = false;
}

console.log("Now please input the image tag:");
let imageTag = prompt("");
loop = true;
while (loop) {
	if (/:/i.test(imageName)) {
		console.log(
			"Invalid Input. The `:` character is reserved.\nPlease try again."
		);
		imageTag = prompt("");
	} else loop = false;
}

//* Build process
log.info("Beginning build proccess...");

//remove build folder if it exists
log.info("Checking for build folder...");
if (existsSync(__dirname.split("/scripts")[0] + "/build")) {
	shell.rm("-r", "build");
	log.info("Build folder found and removed.");
} else log.info("Build folder not found.");

//compile code
shell.exec("yarn tsc && yarn tsc-alias");
shell.cp("", "src/config.json", "build");
log.info("Compiled Typescript files.");

//build Prisma for arm64
shell.exec("yarn prisma generate --generator prodARM64");
log.info("Built Prisma for linux/arm64.");

//build docker image for arm64
shell.exec(
	`docker build --platform linux/arm64 -t ${imageName}:${imageTag}-arm64 .`
);
log.info("Built Docker Image for arm64.");

//delete Prisma from built folder to avoid conflicts
log.info("Removing files that will be rebuilt...");
shell.rm("-r", "build/lib/prisma-client");

//build Prisma for amd64
shell.exec("yarn prisma generate --generator prodAMD64");
log.info("Built Prisma for linux/amd64");

//build docker image for amd64
shell.exec(
	`docker build --platform linux/amd64 -t ${imageName}:${imageTag}-amd64 .`
);
log.info("Built Docker Image for amd64.");

log.info("Build finished!");
