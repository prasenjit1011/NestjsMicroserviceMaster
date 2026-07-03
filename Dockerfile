# ==========================
# Build Stage
# ==========================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Install OpenSSL (required by Prisma)
RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy dependency files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy full source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS application
RUN npm run build

# Ensure build output exists
RUN test -f dist/src/main.js

# Remove dev dependencies for production
RUN npm prune --omit=dev


# ==========================
# Runtime Stage
# ==========================
FROM node:22-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install runtime dependencies (Prisma needs OpenSSL)
RUN apt-get update && \
    apt-get install -y openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy only necessary artifacts
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Prisma runtime safety check (optional but useful)
RUN ls -la node_modules/.prisma || true

# Expose Cloud Run port
EXPOSE 8080

# Start app
CMD ["node", "dist/src/main.js"]