FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

ENV DB_HOST=127.0.0.1
ENV DB_USER=dbuser
ENV DB_PASSWORD=userpassword
ENV DB_NAME=tododb

CMD ["node", "index.js"] 