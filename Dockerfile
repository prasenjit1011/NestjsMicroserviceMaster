# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

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

# ==========================
# Runtime Stage
# ==========================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Verify runtime image
RUN echo "===== Runtime dist ====="
RUN find /app/dist -type f

EXPOSE 8080

CMD ["node", "dist/src/main.js"]