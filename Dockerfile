FROM node:18.12.1

WORKDIR /big-chungus

COPY package.json .

COPY build .

RUN yarn install --production

CMD ["yarn", "start"]