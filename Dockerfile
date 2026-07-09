# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# --------------------------
# Copy package files
# --------------------------
COPY package*.json ./

RUN echo "===== Install Dependencies =====" && \
    npm ci && \
    echo "Exit Code: $?"

# --------------------------
# Copy source
# --------------------------
COPY . .

RUN echo "===== Source Files =====" && \
    pwd && \
    ls -lah && \
    echo "Exit Code: $?"

# --------------------------
# Build
# --------------------------
RUN echo "===== Build =====" && \
    npm run build && \
    echo "Exit Code: $?"

# --------------------------
# Verify Build
# --------------------------
RUN echo "===== DIST =====" && \
    find dist -type f && \
    echo && \
    echo "===== Verify =====" && \
    test -f dist/src/main.js && \
    test -f dist/src/proto/item.proto && \
    test -f dist/src/proto/order.proto && \
    echo "1. All files exist."

RUN test -f dist/main.js && \
    test -f dist/src/proto/item.proto && \
    test -f dist/src/proto/order.proto && \
    echo "2. All files exist."

# --------------------------
# Remove dev dependencies
# --------------------------
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

# --------------------------
# Verify Runtime
# --------------------------
RUN echo "===== Runtime =====" && \
    pwd && \
    ls -lah && \
    echo && \
    echo "===== DIST =====" && \
    find dist -type f && \
    echo && \
    echo "===== Verify =====" && \
    test -f dist/src/main.js && \
    test -f dist/src/proto/item.proto && \
    test -f dist/src/proto/order.proto && \
    echo "Runtime verification successful."

EXPOSE 3000




CMD ["node", "dist/main.js"]