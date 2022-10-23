FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ARG DiscordBotToken

ENV DISCORD_BOT_TOKEN ${DiscordBotToken}

CMD ["npm", "start"]