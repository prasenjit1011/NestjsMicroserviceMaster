# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project source
COPY . .

# Build NestJS
RUN npm run build

# --------------------------
# Verify build output
# --------------------------
RUN echo "===== Build Output =====" && \
    ls -lah && \
    ls -lah dist && \
    find dist -type f && \
    test -f dist/main.js

# Remove development dependencies
RUN npm prune --omit=dev

# ==========================
# Runtime Stage
# ==========================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

# Copy application
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Copy all proto files required by gRPC
COPY --from=builder /app/src/proto ./dist/proto

# --------------------------
# Verify runtime image
# --------------------------
RUN echo "===== Runtime Files =====" && \
    pwd && \
    ls -lah && \
    echo "===== dist =====" && \
    find dist -type f && \
    echo "===== proto =====" && \
    ls -lah dist/proto && \
    test -f dist/main.js && \
    test -f dist/proto/item.proto

# Cloud Run listens on 3000
EXPOSE 3000

CMD ["node", "dist/main.js"]