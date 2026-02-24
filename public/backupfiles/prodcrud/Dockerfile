FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm config set registry https://registry.npmmirror.com
RUN npm ci --legacy-peer-deps
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
