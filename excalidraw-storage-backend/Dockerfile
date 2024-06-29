FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

USER node

EXPOSE 8080

ENTRYPOINT ["npm", "run", "start:prod"]
