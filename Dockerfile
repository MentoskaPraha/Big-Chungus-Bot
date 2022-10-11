FROM node:16

WORKDIR /liveApp

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "test"]