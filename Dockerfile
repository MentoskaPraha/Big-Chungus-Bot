FROM node:18.16.0-slim

WORKDIR /big-chungus

COPY package.json .

COPY build ./src

RUN yarn install --production

CMD ["yarn", "start"]