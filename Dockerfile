FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV DISCORD_BOT_TOKEN 0000

CMD ["npm", "test"]