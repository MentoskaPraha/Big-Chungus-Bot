FROM node:18.15.0-slim

WORKDIR /big-chungus

COPY package.json .

COPY build .

RUN yarn install --production

CMD ["yarn", "start"]