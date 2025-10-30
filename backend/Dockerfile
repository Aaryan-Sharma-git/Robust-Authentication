FROM node:22-alpine3.21

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]