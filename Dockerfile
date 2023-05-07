FROM node:18.16.0-slim

WORKDIR /big-chungus

COPY package.json .

COPY build ./src

COPY prisma ./prisma

RUN yarn install --production

RUN yarn prisma generate

CMD ["yarn", "start"]