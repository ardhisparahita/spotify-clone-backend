# DEVELOPMENT
FROM node:20-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

# source code JANGAN di-build
COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# PRODUCTION
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
