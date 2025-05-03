FROM node:23-alpine
WORKDIR /app
COPY . .
RUN npm i
CMD ["node", "server-test.js"]