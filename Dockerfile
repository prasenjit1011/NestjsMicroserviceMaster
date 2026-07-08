# ==========================
# Build Stage
# ==========================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build NestJS
RUN npm run build

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
RUN echo "All compiled files"
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
ENV GRPC_URL=0.0.0.0:50051
ENV NODE_OPTIONS="--trace-uncaught --trace-warnings"

# Copy runtime files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# --------------------------
# Verify runtime image
# --------------------------
RUN echo "================================="
RUN echo "Runtime Directory"
RUN pwd

RUN echo "================================="
RUN echo "dist"
RUN ls -lah dist

RUN echo "================================="
RUN echo "dist/src"
RUN ls -lah dist/src || true

RUN echo "================================="
RUN echo "Compiled Files"
RUN find dist -type f

RUN echo "================================="
RUN echo "Proto Files"
RUN find /app -name "*.proto"

RUN test -f dist/src/main.js

# Expose ports
EXPOSE 8080
EXPOSE 50051

# Start application
CMD ["node", "dist/src/main.js"]