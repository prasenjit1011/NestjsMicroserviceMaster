# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install all dependencies
RUN npm ci

# Copy project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS
RUN npm run build

# --------------------------
# Verify Prisma Client
# --------------------------
RUN echo "===== Prisma Client =====" && \
    ls -R node_modules/.prisma && \
    ls -R node_modules/@prisma/client

# --------------------------
# Verify build output
# --------------------------
RUN echo "===== Build Output =====" && \
    pwd && \
    ls -lah && \
    echo "===== dist =====" && \
    ls -lah dist && \
    echo "===== dist/src =====" && \
    ls -lah dist/src && \
    echo "===== Compiled Files =====" && \
    find dist -type f && \
    test -f dist/src/main.js

# Remove development dependencies
RUN npm prune --omit=dev

# ==========================
# Runtime Stage
# ==========================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV ORDER_GRPC_URL=0.0.0.0:50042

# Copy application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Copy proto files
COPY --from=builder /app/src/proto ./dist/src/proto

# --------------------------
# Verify runtime image
# --------------------------
RUN echo "===== Runtime =====" && \
    pwd && \
    ls -lah && \
    echo "===== dist =====" && \
    find dist -type f && \
    echo "===== Prisma Runtime =====" && \
    ls -R node_modules/.prisma && \
    ls -R node_modules/@prisma/client && \
    echo "===== Proto =====" && \
    ls -lah dist/src/proto && \
    test -f dist/src/main.js

# gRPC Port
EXPOSE 50042

CMD ["node", "dist/src/main.js"]