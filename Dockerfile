FROM node:16

WORKDIR /app

COPY package.json ./

RUN npm install --production

ADD ./src .

CMD ["npm", "start"]