# Dockerfile for a Node.js application
FROM node:18
WORKDIR /app
RUN npm set registry https://registry.npmmirror.com
COPY package*.json ./
#RUN npm ci --legacy-peer-deps --fetch-timeout=600000 --cache /tmp/npm-cache
RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "start"]
