FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Command is overridden in docker-compose
CMD ["npm", "run", "dev"]
