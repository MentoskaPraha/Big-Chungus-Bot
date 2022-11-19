FROM node:18.12.1

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

ADD ./prod .

CMD ["npm", "start"]