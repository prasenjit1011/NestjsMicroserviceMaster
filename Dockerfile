################
# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first (better Docker cache)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build NestJS
RUN npm run build

RUN ls -R
RUN ls -la dist

RUN echo "===== Build Output =====" && ls -R dist

# Remove dev dependencies
RUN npm prune --omit=dev


# ==========================
# Runtime Stage
# ==========================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/main.js"]