FROM node:lts-alpine

RUN apk add --update postgresql-client

WORKDIR /app
COPY . .


RUN chmod +x ./wait-for-postgres.sh

RUN npm install

RUN npm run build

EXPOSE 3000
