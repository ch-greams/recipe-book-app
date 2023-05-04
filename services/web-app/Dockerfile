FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ARG RB__API_ADDR
ARG RB__AUTH_API_ADDR

ENV RB__API_ADDR $RB__API_ADDR
ENV RB__AUTH_API_ADDR $RB__AUTH_API_ADDR

RUN npm run build

CMD npm start
