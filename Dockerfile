# ==========================
# Build Stage
# ==========================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Verify Prisma Client & Query Engine
RUN echo "================================="
RUN echo "Prisma Client"
RUN find node_modules/.prisma -type f || true

RUN echo "================================="
RUN echo "@prisma"
RUN find node_modules/@prisma -type f || true

# Build NestJS
RUN npm run build

# --------------------------
# Verify build output
# --------------------------
RUN echo "================================="
RUN echo "Contents of /app"
RUN ls -la

RUN echo "================================="
RUN echo "Contents of dist"
RUN ls -la dist || true

RUN echo "================================="
RUN echo "All files under dist"
RUN find dist -type f || true

RUN echo "================================="
RUN echo "Searching for main.js"
RUN find . -name "main.js"

# Fail build if main.js doesn't exist
RUN test -f dist/src/main.js

# Remove dev dependencies
RUN npm prune --omit=dev

# Verify Prisma still exists after pruning
RUN echo "================================="
RUN echo "Prisma after npm prune"
RUN find node_modules/.prisma -type f || true
RUN find node_modules/@prisma -type f || true

# ==========================
# Runtime Stage
# ==========================
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production

# Install OpenSSL (required by Prisma)
RUN apt-get update && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# Copy application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Verify Prisma engine exists
RUN echo "================================="
RUN echo "Runtime Prisma"
RUN find /app/node_modules/.prisma -type f || true
RUN find /app/node_modules/@prisma -type f || true

EXPOSE 8080

CMD ["node", "dist/src/main.js"]