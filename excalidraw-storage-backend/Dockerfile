FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY ./dist ./dist

USER node

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start:prod"]
