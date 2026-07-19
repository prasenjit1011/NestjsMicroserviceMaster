# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy Prisma schema (for better Docker layer caching)
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy project source
COPY . .

# Generate Prisma Client and build the application
RUN npx prisma generate && npm run build

# --------------------------
# Verify build output
# --------------------------
RUN echo "================================="
RUN echo "Contents of /app"
RUN ls -lah

RUN echo "================================="
RUN echo "Contents of dist"
RUN ls -lah dist || true

RUN echo "================================="
RUN echo "Contents of dist/src"
RUN ls -lah dist/src || true

RUN echo "================================="
RUN echo "Contents of common-proto"
RUN ls -lah common-proto/proto || true

RUN echo "================================="
RUN echo "Compiled files"
RUN find dist -type f

RUN test -f dist/src/main.js

# Remove development dependencies
RUN npm prune --omit=dev


# ==========================
# Runtime Stage
# ==========================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV ITEM_GRPC_URL=0.0.0.0:50041

# Copy package metadata
COPY --from=builder /app/package*.json ./

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Copy Prisma schema (only if required at runtime)
COPY --from=builder /app/prisma ./prisma

# Copy gRPC proto files from the common Git submodule
COPY --from=builder /app/common-proto/proto ./dist/src/proto

# --------------------------
# Verify runtime image
# --------------------------
RUN echo "===== Runtime ====="

RUN echo "===== dist ====="
RUN ls -lah dist

RUN echo "===== dist/src ====="
RUN ls -lah dist/src

RUN echo "===== proto ====="
RUN ls -lah dist/src/proto

RUN echo "===== Compiled Files ====="
RUN find dist -type f

RUN test -f dist/src/main.js

# Expose gRPC port
EXPOSE 50041

# Start application
CMD ["node", "dist/src/main.js"]