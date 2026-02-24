# # Dockerfile
# FROM node:18-slim

# WORKDIR /app
# COPY package*.json ./
# # RUN npm ci --verbose
# RUN npm config set registry https://registry.npm.taobao.org/ && npm ci --verbose
# COPY app.js ./
# EXPOSE 3000
# CMD ["node", "app.js"]




# FROM node:18-slim
# WORKDIR /app
# COPY package*.json ./
# # RUN npm install
# RUN npm config set registry https://registry.npm.taobao.org/ && npm ci --verbose
# COPY app.js ./
# EXPOSE 3000
# CMD ["node", "app.js"]



# FROM node:18-slim
# WORKDIR /app
# COPY package*.json ./
# RUN npm config set registry https://registry.npm.taobao.org/ && npm ci --verbose
# COPY . .
# EXPOSE 3000
# CMD ["node", "app.js"]



# FROM node:18-slim
# WORKDIR /app
# COPY package*.json ./
# RUN npm config set registry https://registry.npmjs.org/
# RUN npm cache clean --force
# RUN npm install --verbose
# COPY . .
# EXPOSE 3000
# CMD ["node", "app.js"]




# FROM node:18-slim
# WORKDIR /app
# COPY package*.json ./
# RUN npm config set registry https://registry.npmjs.org/ \
#     && npm cache clean --force \
#     && npm install --verbose

# COPY . .
# EXPOSE 3000
# CMD ["node", "app.js"]



# Use a slim Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package files first (to leverage Docker cache)
COPY package*.json ./

# Use npm cache and install dependencies
RUN npm config set registry https://registry.npmjs.org/ \
    && npm ci --verbose

# Copy the app source
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
